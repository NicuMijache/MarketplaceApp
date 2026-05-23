using API.Data;
using API.DTOs.Contact;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

/// <summary>
/// Contact flow:
/// 1. Public POST: buyer submits form → saved to DB → email sent via SendGrid
/// 2. Authenticated GET: seller sees received messages for their listings
///
/// The email is sent AFTER saving to DB. If SendGrid fails, we still have the
/// message in DB (seller can check the portal). This is the "at-least-once" pattern.
/// </summary>
public class ContactController : BaseApiController
{
    private readonly AppDbContext _context;
    private readonly IEmailService _emailService;
    private readonly IMapper _mapper;
    private readonly ILogger<ContactController> _logger;
    private readonly IConfiguration _config;

    public ContactController(
        AppDbContext context,
        IEmailService emailService,
        IMapper mapper,
        ILogger<ContactController> logger,
        IConfiguration config)
    {
        _context = context;
        _emailService = emailService;
        _mapper = mapper;
        _logger = logger;
        _config = config;
    }

    // POST /api/contact/{listingId} — public, anyone can send
    [HttpPost("{listingId:guid}")]
    public async Task<ActionResult> SendContactRequest(Guid listingId, CreateContactRequestDto dto)
    {
        var listing = await _context.Listings
            .Include(l => l.User)
            .FirstOrDefaultAsync(l => l.Id == listingId);

        if (listing == null) return NotFound("Listing not found");
        if (listing.Status != ListingStatus.Active)
            return BadRequest("Cannot contact seller for an inactive listing");

        var contactRequest = _mapper.Map<ContactRequest>(dto);
        contactRequest.ListingId = listingId;
        contactRequest.SentAt = DateTime.UtcNow;

        _context.ContactRequests.Add(contactRequest);
        await _context.SaveChangesAsync();

        // Send email async — log error but don't fail the response
        try
        {
            var frontendUrl = _config["FrontendUrl"] ?? "http://localhost:4200";
            var listingUrl = $"{frontendUrl}/listings/{listingId}";

            await _emailService.SendContactEmailAsync(
                toEmail: listing.User.Email ?? "",
                toName: listing.User.UserName ?? "",
                senderName: dto.SenderName,
                senderEmail: dto.SenderEmail,
                senderPhone: dto.SenderPhone,
                message: dto.Message,
                listingTitle: listing.Title,
                listingUrl: listingUrl
            );
        }
        catch (Exception ex)
        {
            // Email failure is not a blocker — message is already saved
            _logger.LogError(ex, "Failed to send contact email for listing {ListingId}", listingId);
        }

        return Ok(new { message = "Message sent successfully" });
    }

    // GET /api/contact/received — authenticated seller sees their inbox
    [Authorize]
    [HttpGet("received")]
    public async Task<ActionResult<IEnumerable<ContactRequestDto>>> GetReceivedMessages()
    {
        var userId = GetCurrentUserId();

        var messages = await _context.ContactRequests
            .Include(c => c.Listing)
            .Where(c => c.Listing.UserId == userId)
            .OrderByDescending(c => c.SentAt)
            .ToListAsync();

        return Ok(_mapper.Map<IEnumerable<ContactRequestDto>>(messages));
    }
}

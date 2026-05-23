using API.Data;
using API.Data.UnitOfWork;
using API.DTOs.Account;
using API.DTOs.Listings;
using API.Entities;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

/// <summary>
/// Admin-only endpoints. [Authorize(Roles = "Admin")] means:
/// - Must have a valid JWT AND
/// - JWT must contain a "Admin" role claim
/// If either fails → 401/403 automatically.
/// </summary>
[Authorize(Roles = "Admin")]
public class AdminController : BaseApiController
{
    private readonly AppDbContext _context;
    private readonly IUnitOfWork _uow;
    private readonly IMapper _mapper;
    private readonly UserManager<AppUser> _userManager;

    public AdminController(
        AppDbContext context,
        IUnitOfWork uow,
        IMapper mapper,
        UserManager<AppUser> userManager)
    {
        _context = context;
        _uow = uow;
        _mapper = mapper;
        _userManager = userManager;
    }

    // GET /api/admin/listings — all listings for moderation
    [HttpGet("listings")]
    public async Task<ActionResult<IEnumerable<ListingDto>>> GetAllListings()
    {
        var listings = await _context.Listings
            .Include(l => l.Images)
            .Include(l => l.User)
            .Include(l => l.Category)
            .OrderByDescending(l => l.CreatedAt)
            .ToListAsync();

        return Ok(_mapper.Map<IEnumerable<ListingDto>>(listings));
    }

    // PUT /api/admin/listings/{id} — approve/reject (change status)
    [HttpPut("listings/{id:guid}")]
    public async Task<ActionResult> UpdateListingStatus(Guid id, UpdateListingStatusDto dto)
    {
        var listing = await _context.Listings.FindAsync(id);
        if (listing == null) return NotFound();

        if (!Enum.TryParse<ListingStatus>(dto.Status, out var newStatus))
            return BadRequest("Invalid status");

        listing.Status = newStatus;
        listing.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();
        return NoContent();
    }

    // GET /api/admin/users
    [HttpGet("users")]
    public async Task<ActionResult<IEnumerable<UserDto>>> GetAllUsers()
    {
        var users = await _context.Users
            .OrderByDescending(u => u.CreatedAt)
            .ToListAsync();

        return Ok(_mapper.Map<IEnumerable<UserDto>>(users));
    }

    // DELETE /api/admin/users/{id} — ban user (set IsActive = false, not hard delete)
    [HttpDelete("users/{id:guid}")]
    public async Task<ActionResult> BanUser(Guid id)
    {
        var user = await _userManager.FindByIdAsync(id.ToString());
        if (user == null) return NotFound();

        // Soft delete: preserve data, just deactivate
        user.IsActive = false;
        await _userManager.UpdateAsync(user);
        return NoContent();
    }
}

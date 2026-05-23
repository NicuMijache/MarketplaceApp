using API.Data;
using API.DTOs.Listings;
using API.Entities;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

/// <summary>
/// Toggle-style favorites. POST either adds or removes (idempotent).
/// All endpoints require JWT — you must be logged in to save listings.
/// </summary>
[Authorize]
public class FavoritesController : BaseApiController
{
    private readonly AppDbContext _context;
    private readonly IMapper _mapper;

    public FavoritesController(AppDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    // GET /api/favorites — all of current user's saved listings
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ListingCardDto>>> GetFavorites()
    {
        var userId = GetCurrentUserId();

        var favorites = await _context.Favorites
            .Include(f => f.Listing)
                .ThenInclude(l => l.Images)
            .Include(f => f.Listing)
                .ThenInclude(l => l.User)
            .Include(f => f.Listing)
                .ThenInclude(l => l.Category)
            .Where(f => f.UserId == userId)
            .OrderByDescending(f => f.SavedAt)
            .ToListAsync();

        var listings = favorites.Select(f => f.Listing);
        return Ok(_mapper.Map<IEnumerable<ListingCardDto>>(listings));
    }

    // POST /api/favorites/{listingId} — toggle (add if not exists, otherwise treated as duplicate → 400)
    [HttpPost("{listingId:guid}")]
    public async Task<ActionResult> AddFavorite(Guid listingId)
    {
        var userId = GetCurrentUserId();

        var listingExists = await _context.Listings.AnyAsync(l => l.Id == listingId);
        if (!listingExists) return NotFound("Listing not found");

        var existing = await _context.Favorites
            .FirstOrDefaultAsync(f => f.UserId == userId && f.ListingId == listingId);

        if (existing != null)
            return BadRequest("Listing already in favorites");

        var favorite = new Favorite
        {
            UserId = userId,
            ListingId = listingId,
            SavedAt = DateTime.UtcNow
        };

        _context.Favorites.Add(favorite);
        await _context.SaveChangesAsync();
        return Ok();
    }

    // DELETE /api/favorites/{listingId}
    [HttpDelete("{listingId:guid}")]
    public async Task<ActionResult> RemoveFavorite(Guid listingId)
    {
        var userId = GetCurrentUserId();

        var favorite = await _context.Favorites
            .FirstOrDefaultAsync(f => f.UserId == userId && f.ListingId == listingId);

        if (favorite == null) return NotFound("Favorite not found");

        _context.Favorites.Remove(favorite);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}

using API.Data.UnitOfWork;
using API.DTOs.Listings;
using API.DTOs.Shared;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

/// <summary>
/// All listing CRUD + image management.
/// Images are sub-resources: /api/listings/{id}/images/{imgId}
///
/// Authorization checks (listing.UserId == currentUser.Id) happen here
/// because it's an ownership check, not domain logic — it's fine in the controller.
/// Actual business logic (e.g. "a listing can only be sold if it has images") would go in a service.
/// </summary>
public class ListingsController : BaseApiController
{
    private readonly IUnitOfWork _uow;
    private readonly IMapper _mapper;
    private readonly IPhotoService _photoService;

    public ListingsController(IUnitOfWork uow, IMapper mapper, IPhotoService photoService)
    {
        _uow = uow;
        _mapper = mapper;
        _photoService = photoService;
    }

    // GET /api/listings?search=iphone&city=Cluj&categoryId=...&minPrice=100&pageNumber=1&pageSize=10
    [HttpGet]
    public async Task<ActionResult<PaginatedResult<ListingCardDto>>> GetListings(
        [FromQuery] ListingFilterParams filterParams)
    {
        var (items, totalCount) = await _uow.Listings.GetPagedAsync(filterParams);
        var dtos = _mapper.Map<IEnumerable<ListingCardDto>>(items);
        return Ok(new PaginatedResult<ListingCardDto>(dtos, totalCount, filterParams.PageNumber, filterParams.PageSize));
    }

    // GET /api/listings/{id}
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ListingDto>> GetListing(Guid id)
    {
        var listing = await _uow.Listings.GetByIdWithDetailsAsync(id);
        if (listing == null) return NotFound();

        var dto = _mapper.Map<ListingDto>(listing);

        // Check if current user has favorited this listing (if authenticated)
        if (User.Identity?.IsAuthenticated == true)
        {
            // This would require a Favorites repository — simplified for now
            // Real implementation: await _uow.Favorites.IsFavoritedAsync(userId, id)
            dto.IsFavoritedByCurrentUser = false;
        }

        return Ok(dto);
    }

    // GET /api/listings/my — current user's listings
    [Authorize]
    [HttpGet("my")]
    public async Task<ActionResult<IEnumerable<ListingDto>>> GetMyListings()
    {
        var userId = GetCurrentUserId();
        var listings = await _uow.Listings.GetByUserIdAsync(userId);
        return Ok(_mapper.Map<IEnumerable<ListingDto>>(listings));
    }

    // POST /api/listings
    [Authorize]
    [HttpPost]
    public async Task<ActionResult<ListingDto>> CreateListing(CreateListingDto dto)
    {
        var userId = GetCurrentUserId();
        var listing = _mapper.Map<Listing>(dto);
        listing.UserId = userId;

        await _uow.Listings.AddAsync(listing);
        if (!await _uow.SaveChangesAsync())
            return BadRequest("Failed to create listing");

        // Re-fetch with related data to return full DTO
        var created = await _uow.Listings.GetByIdWithDetailsAsync(listing.Id);
        return CreatedAtAction(nameof(GetListing), new { id = listing.Id }, _mapper.Map<ListingDto>(created));
    }

    // PUT /api/listings/{id}
    [Authorize]
    [HttpPut("{id:guid}")]
    public async Task<ActionResult> UpdateListing(Guid id, UpdateListingDto dto)
    {
        var userId = GetCurrentUserId();
        var listing = await _uow.Listings.GetByIdAsync(id);

        if (listing == null) return NotFound();
        if (listing.UserId != userId) return Forbid();  // ownership check

        // Only update fields that were provided (partial update pattern)
        if (dto.Title != null)        listing.Title = dto.Title;
        if (dto.Description != null)  listing.Description = dto.Description;
        if (dto.Price.HasValue)       listing.Price = dto.Price.Value;
        if (dto.City != null)         listing.City = dto.City;
        if (dto.IsNegotiable.HasValue) listing.IsNegotiable = dto.IsNegotiable.Value;
        if (dto.CategoryId.HasValue)  listing.CategoryId = dto.CategoryId.Value;
        listing.UpdatedAt = DateTime.UtcNow;

        _uow.Listings.Update(listing);
        if (!await _uow.SaveChangesAsync())
            return BadRequest("Failed to update listing");

        return NoContent();
    }

    // DELETE /api/listings/{id}
    [Authorize]
    [HttpDelete("{id:guid}")]
    public async Task<ActionResult> DeleteListing(Guid id)
    {
        var userId = GetCurrentUserId();
        var listing = await _uow.Listings.GetByIdWithDetailsAsync(id);

        if (listing == null) return NotFound();
        if (listing.UserId != userId) return Forbid();

        // Delete all Cloudinary images before removing from DB
        foreach (var image in listing.Images)
            await _photoService.DeletePhotoAsync(image.PublicId);

        _uow.Listings.Delete(listing);
        if (!await _uow.SaveChangesAsync())
            return BadRequest("Failed to delete listing");

        return NoContent();
    }

    // PUT /api/listings/{id}/status
    [Authorize]
    [HttpPut("{id:guid}/status")]
    public async Task<ActionResult> UpdateStatus(Guid id, UpdateListingStatusDto dto)
    {
        var userId = GetCurrentUserId();
        var listing = await _uow.Listings.GetByIdAsync(id);

        if (listing == null) return NotFound();
        if (listing.UserId != userId) return Forbid();

        if (!Enum.TryParse<ListingStatus>(dto.Status, out var newStatus))
            return BadRequest($"Invalid status. Use: {string.Join(", ", Enum.GetNames<ListingStatus>())}");

        listing.Status = newStatus;
        listing.UpdatedAt = DateTime.UtcNow;
        _uow.Listings.Update(listing);
        await _uow.SaveChangesAsync();
        return NoContent();
    }

    // ── Image sub-resource endpoints ─────────────────────────────────────────

    // POST /api/listings/{id}/images
    [Authorize]
    [HttpPost("{id:guid}/images")]
    public async Task<ActionResult<ListingImageDto>> UploadImage(Guid id, IFormFile file)
    {
        var userId = GetCurrentUserId();
        var listing = await _uow.Listings.GetByIdWithDetailsAsync(id);

        if (listing == null) return NotFound();
        if (listing.UserId != userId) return Forbid();

        if (listing.Images.Count >= 10)
            return BadRequest("Maximum 10 images per listing");

        var uploadResult = await _photoService.AddPhotoAsync(file);
        if (uploadResult.Error != null)
            return BadRequest(uploadResult.Error.Message);

        var image = new ListingImage
        {
            ListingId = id,
            ImageUrl = uploadResult.SecureUrl.ToString(),
            PublicId = uploadResult.PublicId,
            IsMain = !listing.Images.Any(),  // first image is main by default
            Order = listing.Images.Count
        };

        listing.Images.Add(image);
        _uow.Listings.Update(listing);
        await _uow.SaveChangesAsync();

        return Ok(_mapper.Map<ListingImageDto>(image));
    }

    // DELETE /api/listings/{id}/images/{imgId}
    [Authorize]
    [HttpDelete("{id:guid}/images/{imgId:guid}")]
    public async Task<ActionResult> DeleteImage(Guid id, Guid imgId)
    {
        var userId = GetCurrentUserId();
        var listing = await _uow.Listings.GetByIdWithDetailsAsync(id);

        if (listing == null) return NotFound();
        if (listing.UserId != userId) return Forbid();

        var image = listing.Images.FirstOrDefault(i => i.Id == imgId);
        if (image == null) return NotFound("Image not found");

        await _photoService.DeletePhotoAsync(image.PublicId);
        listing.Images.Remove(image);

        // If we deleted the main image, promote the first remaining to main
        if (image.IsMain && listing.Images.Any())
            listing.Images.OrderBy(i => i.Order).First().IsMain = true;

        _uow.Listings.Update(listing);
        await _uow.SaveChangesAsync();
        return NoContent();
    }

    // PUT /api/listings/{id}/images/{imgId}/main
    [Authorize]
    [HttpPut("{id:guid}/images/{imgId:guid}/main")]
    public async Task<ActionResult> SetMainImage(Guid id, Guid imgId)
    {
        var userId = GetCurrentUserId();
        var listing = await _uow.Listings.GetByIdWithDetailsAsync(id);

        if (listing == null) return NotFound();
        if (listing.UserId != userId) return Forbid();

        foreach (var img in listing.Images)
            img.IsMain = img.Id == imgId;

        _uow.Listings.Update(listing);
        await _uow.SaveChangesAsync();
        return NoContent();
    }
}

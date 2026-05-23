using API.Data;
using API.DTOs.Listings;
using API.DTOs.Shared;
using API.Helpers;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

/// <summary>
/// Read-only endpoints for category browsing.
/// Categories are mostly static data — no authentication needed.
/// We inject AppDbContext directly here (not through UoW) because
/// these are simple read operations with no business logic.
/// </summary>
public class CategoriesController : BaseApiController
{
    private readonly AppDbContext _context;
    private readonly IMapper _mapper;

    public CategoriesController(AppDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    // GET /api/categories — returns tree structure (parents with nested children)
    [HttpGet]
    public async Task<ActionResult<IEnumerable<CategoryDto>>> GetCategories()
    {
        var categories = await _context.Categories
            .Include(c => c.Children)
            .Where(c => c.ParentId == null)  // only top-level, children are nested
            .OrderBy(c => c.Name)
            .ToListAsync();

        return Ok(_mapper.Map<IEnumerable<CategoryDto>>(categories));
    }

    // GET /api/categories/{id}/listings
    [HttpGet("{id:guid}/listings")]
    public async Task<ActionResult<PaginatedResult<ListingCardDto>>> GetCategoryListings(
        Guid id, [FromQuery] PaginationParams paginationParams)
    {
        var category = await _context.Categories.FindAsync(id);
        if (category == null) return NotFound();

        var listings = await _context.Listings
            .Include(l => l.Images)
            .Include(l => l.User)
            .Include(l => l.Category)
            .Where(l => l.CategoryId == id && l.Status == Entities.ListingStatus.Active)
            .OrderByDescending(l => l.CreatedAt)
            .ToListAsync();

        var totalCount = listings.Count;
        var paged = listings
            .Skip((paginationParams.PageNumber - 1) * paginationParams.PageSize)
            .Take(paginationParams.PageSize);

        var dtos = _mapper.Map<IEnumerable<ListingCardDto>>(paged);
        return Ok(new PaginatedResult<ListingCardDto>(dtos, totalCount,
            paginationParams.PageNumber, paginationParams.PageSize));
    }
}

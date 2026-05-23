using API.Entities;
using API.Helpers;
using Microsoft.EntityFrameworkCore;

namespace API.Data.Repositories;

/// <summary>
/// All DB queries for listings live here. Using IQueryable composition
/// lets us build the filter query incrementally before hitting the DB —
/// only one SQL query is executed (with all WHERE/ORDER BY applied).
/// </summary>
public class ListingRepository : IListingRepository
{
    private readonly AppDbContext _context;

    public ListingRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Listing?> GetByIdAsync(Guid id)
        => await _context.Listings.FindAsync(id);

    public async Task<Listing?> GetByIdWithDetailsAsync(Guid id)
        => await _context.Listings
            .Include(l => l.Images.OrderBy(i => i.Order))
            .Include(l => l.User)
            .Include(l => l.Category)
            .FirstOrDefaultAsync(l => l.Id == id);

    public async Task<(IEnumerable<Listing> Items, int TotalCount)> GetPagedAsync(ListingFilterParams p)
    {
        // Build query with IQueryable — EF translates this to a single SQL statement
        var query = _context.Listings
            .Include(l => l.Images)
            .Include(l => l.User)
            .Include(l => l.Category)
            .AsQueryable();

        // Status filter (default to Active if not specified)
        if (!string.IsNullOrEmpty(p.Status) && Enum.TryParse<ListingStatus>(p.Status, out var status))
            query = query.Where(l => l.Status == status);
        else
            query = query.Where(l => l.Status == ListingStatus.Active);

        // Full-text search on title and description
        if (!string.IsNullOrWhiteSpace(p.Search))
        {
            var term = p.Search.ToLower();
            query = query.Where(l =>
                l.Title.ToLower().Contains(term) ||
                l.Description.ToLower().Contains(term));
        }

        if (!string.IsNullOrEmpty(p.City))
            query = query.Where(l => l.City.ToLower().Contains(p.City.ToLower()));

        if (p.CategoryId.HasValue)
            query = query.Where(l => l.CategoryId == p.CategoryId.Value);

        if (p.MinPrice.HasValue)
            query = query.Where(l => l.Price >= p.MinPrice.Value);

        if (p.MaxPrice.HasValue)
            query = query.Where(l => l.Price <= p.MaxPrice.Value);

        // Apply sorting
        query = p.OrderBy switch
        {
            "price_asc"  => query.OrderBy(l => l.Price),
            "price_desc" => query.OrderByDescending(l => l.Price),
            _            => query.OrderByDescending(l => l.CreatedAt)  // default: newest first
        };

        var totalCount = await query.CountAsync();
        var items = await query
            .Skip((p.PageNumber - 1) * p.PageSize)
            .Take(p.PageSize)
            .ToListAsync();

        return (items, totalCount);
    }

    public async Task<IEnumerable<Listing>> GetByUserIdAsync(Guid userId)
        => await _context.Listings
            .Include(l => l.Images)
            .Include(l => l.Category)
            .Where(l => l.UserId == userId)
            .OrderByDescending(l => l.CreatedAt)
            .ToListAsync();

    public async Task<IEnumerable<Listing>> GetByCategoryAsync(Guid categoryId, PaginationParams p)
        => await _context.Listings
            .Include(l => l.Images)
            .Include(l => l.User)
            .Where(l => l.CategoryId == categoryId && l.Status == ListingStatus.Active)
            .OrderByDescending(l => l.CreatedAt)
            .Skip((p.PageNumber - 1) * p.PageSize)
            .Take(p.PageSize)
            .ToListAsync();

    public async Task AddAsync(Listing listing) => await _context.Listings.AddAsync(listing);

    public void Update(Listing listing) => _context.Listings.Update(listing);

    public void Delete(Listing listing) => _context.Listings.Remove(listing);

    public async Task<bool> ExistsAsync(Guid id) => await _context.Listings.AnyAsync(l => l.Id == id);

    public async Task<ListingImage?> GetImageByIdAsync(Guid imageId)
        => await _context.ListingImages.FindAsync(imageId);
}

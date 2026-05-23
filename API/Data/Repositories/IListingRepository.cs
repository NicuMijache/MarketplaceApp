using API.DTOs.Listings;
using API.Entities;
using API.Helpers;

namespace API.Data.Repositories;

/// <summary>
/// Repository interface defines the contract without exposing EF/DbContext.
/// Controllers → Services → Repositories → DbContext.
/// This keeps EF out of service layer and makes services unit-testable.
/// </summary>
public interface IListingRepository
{
    Task<Listing?> GetByIdAsync(Guid id);
    Task<Listing?> GetByIdWithDetailsAsync(Guid id);     // includes Images, User, Category
    Task<(IEnumerable<Listing> Items, int TotalCount)> GetPagedAsync(ListingFilterParams filterParams);
    Task<IEnumerable<Listing>> GetByUserIdAsync(Guid userId);
    Task<IEnumerable<Listing>> GetByCategoryAsync(Guid categoryId, PaginationParams paginationParams);
    Task AddAsync(Listing listing);
    void Update(Listing listing);
    void Delete(Listing listing);
    Task<bool> ExistsAsync(Guid id);
    Task<ListingImage?> GetImageByIdAsync(Guid imageId);
}

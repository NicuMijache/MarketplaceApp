using API.Data.Repositories;

namespace API.Data.UnitOfWork;

/// <summary>
/// Unit of Work wraps all repositories and a single SaveChangesAsync call.
///
/// WHY: Without UoW, each repository would have its own SaveChanges, meaning
/// a service that updates User + Listing would need two separate saves.
/// With UoW, both changes accumulate in the same DbContext change-tracker,
/// then commit atomically in one database transaction. If anything fails,
/// the whole operation rolls back — data stays consistent.
/// </summary>
public interface IUnitOfWork
{
    IListingRepository Listings { get; }
    IUserRepository Users { get; }
    Task<bool> SaveChangesAsync();
}

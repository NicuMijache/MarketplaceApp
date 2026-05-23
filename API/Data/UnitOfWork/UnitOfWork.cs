using API.Data.Repositories;

namespace API.Data.UnitOfWork;

/// <summary>
/// Concrete UoW. Uses constructor injection to receive AppDbContext,
/// then lazily creates repository instances (they share the same context instance).
/// Registered as Scoped in DI — one UoW per HTTP request.
/// </summary>
public class UnitOfWork : IUnitOfWork
{
    private readonly AppDbContext _context;

    // Lazy initialization: repositories are created only when accessed
    private IListingRepository? _listings;
    private IUserRepository? _users;

    public UnitOfWork(AppDbContext context)
    {
        _context = context;
    }

    public IListingRepository Listings
        => _listings ??= new ListingRepository(_context);

    public IUserRepository Users
        => _users ??= new UserRepository(_context);

    /// <summary>
    /// Returns true if at least one entity was saved.
    /// Returns false if nothing changed (useful for detecting no-ops).
    /// </summary>
    public async Task<bool> SaveChangesAsync()
        => await _context.SaveChangesAsync() > 0;
}

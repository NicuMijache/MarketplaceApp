namespace API.Entities;

/// <summary>
/// Join table between AppUser and Listing.
/// We keep it as a full entity (not just a shadow table) so we can
/// store SavedAt and query it easily via EF.
/// The unique constraint (UserId + ListingId) is enforced in AppDbContext.
/// </summary>
public class Favorite
{
    public Guid Id { get; set; }

    public Guid UserId { get; set; }
    public AppUser User { get; set; } = null!;

    public Guid ListingId { get; set; }
    public Listing Listing { get; set; } = null!;

    public DateTime SavedAt { get; set; } = DateTime.UtcNow;
}

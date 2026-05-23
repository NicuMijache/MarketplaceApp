namespace API.Entities;

/// <summary>
/// Core entity. Status is stored as a string enum so it's human-readable in the DB.
/// All money values use decimal (not float/double) to avoid rounding errors.
/// </summary>
public class Listing
{
    public Guid Id { get; set; }

    // FK to AppUser
    public Guid UserId { get; set; }
    public AppUser User { get; set; } = null!;

    // FK to Category
    public Guid CategoryId { get; set; }
    public Category Category { get; set; } = null!;

    public string Title { get; set; } = string.Empty;         // max 100
    public string Description { get; set; } = string.Empty;   // max 2000
    public decimal Price { get; set; }
    public string City { get; set; } = string.Empty;
    public ListingStatus Status { get; set; } = ListingStatus.Active;
    public bool IsNegotiable { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public ICollection<ListingImage> Images { get; set; } = new List<ListingImage>();
    public ICollection<Favorite> Favorites { get; set; } = new List<Favorite>();
    public ICollection<ContactRequest> ContactRequests { get; set; } = new List<ContactRequest>();
}

/// <summary>
/// Using a C# enum stored as string in the DB (configured in AppDbContext).
/// This is more maintainable than magic strings scattered through code.
/// </summary>
public enum ListingStatus
{
    Active,
    Sold,
    Paused
}

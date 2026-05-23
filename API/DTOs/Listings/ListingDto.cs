namespace API.DTOs.Listings;

/// <summary>
/// Full listing DTO — used for detail view and owner's listing list.
/// The nested DTOs (images, seller) prevent over-fetching and decouple
/// the API contract from the DB schema.
/// </summary>
public class ListingDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string City { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public bool IsNegotiable { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public Guid CategoryId { get; set; }
    public string? MainImageUrl { get; set; }
    public List<ListingImageDto> Images { get; set; } = new();
    public SellerDto Seller { get; set; } = null!;
    public bool IsFavoritedByCurrentUser { get; set; }  // set in service layer
}

public class ListingImageDto
{
    public Guid Id { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public bool IsMain { get; set; }
    public int Order { get; set; }
}

public class SellerDto
{
    public Guid Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string? City { get; set; }
    public string? ProfilePicture { get; set; }
    public string? PhoneNumber { get; set; }
}

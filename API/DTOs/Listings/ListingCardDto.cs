namespace API.DTOs.Listings;

/// <summary>
/// Lightweight DTO for the listings grid / search results page.
/// Only includes data needed to render a card — avoids sending full
/// description and all images over the wire for list views.
/// </summary>
public class ListingCardDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string City { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public bool IsNegotiable { get; set; }
    public DateTime CreatedAt { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public string? MainImageUrl { get; set; }
    public string SellerUsername { get; set; } = string.Empty;
}

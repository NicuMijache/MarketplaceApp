namespace API.DTOs.Listings;

public class CreateListingDto
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string City { get; set; } = string.Empty;
    public bool IsNegotiable { get; set; }
    public Guid CategoryId { get; set; }
}

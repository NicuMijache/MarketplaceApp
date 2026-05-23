namespace API.DTOs.Listings;

public class UpdateListingDto
{
    public string? Title { get; set; }
    public string? Description { get; set; }
    public decimal? Price { get; set; }
    public string? City { get; set; }
    public bool? IsNegotiable { get; set; }
    public Guid? CategoryId { get; set; }
}

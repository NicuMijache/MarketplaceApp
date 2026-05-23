namespace API.DTOs.Listings;

public class UpdateListingStatusDto
{
    /// <summary>Accepted values: "Active", "Sold", "Paused"</summary>
    public string Status { get; set; } = string.Empty;
}

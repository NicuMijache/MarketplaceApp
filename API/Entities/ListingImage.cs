namespace API.Entities;

/// <summary>
/// Each listing can have multiple images stored on Cloudinary.
/// We store both ImageUrl (for display) and PublicId (to call Cloudinary delete API).
/// IsMain flags the primary thumbnail; Order controls gallery display sequence.
/// </summary>
public class ListingImage
{
    public Guid Id { get; set; }

    public Guid ListingId { get; set; }
    public Listing Listing { get; set; } = null!;

    public string ImageUrl { get; set; } = string.Empty;   // Cloudinary secure_url
    public string PublicId { get; set; } = string.Empty;   // Cloudinary public_id (for deletion)
    public bool IsMain { get; set; }
    public int Order { get; set; }
}

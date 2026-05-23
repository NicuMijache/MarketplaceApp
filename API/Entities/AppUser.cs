using Microsoft.AspNetCore.Identity;

namespace API.Entities;

/// <summary>
/// Extends IdentityUser so ASP.NET Identity manages password hashing,
/// roles, claims, tokens — we only add domain-specific fields.
/// Using Guid as the PK type gives us globally unique, non-sequential IDs.
/// </summary>
public class AppUser : IdentityUser<Guid>
{
    public string? City { get; set; }
    public string? ProfilePicture { get; set; }   // Cloudinary URL
    public string? ProfilePicturePublicId { get; set; } // needed to delete from Cloudinary
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public bool IsActive { get; set; } = true;

    // Navigation properties
    public ICollection<Listing> Listings { get; set; } = new List<Listing>();
    public ICollection<Favorite> Favorites { get; set; } = new List<Favorite>();
}

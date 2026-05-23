namespace API.Entities;

/// <summary>
/// Supports self-referential hierarchy: a Category can have a ParentId
/// pointing to another Category, enabling subcategories (e.g. Electronics → Phones).
/// Slug is the URL-safe version of the name (e.g. "home-garden").
/// </summary>
public class Category
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;  // URL-friendly, unique

    // Self-referential FK for subcategories
    public Guid? ParentId { get; set; }
    public Category? Parent { get; set; }
    public ICollection<Category> Children { get; set; } = new List<Category>();

    // Navigation
    public ICollection<Listing> Listings { get; set; } = new List<Listing>();
}

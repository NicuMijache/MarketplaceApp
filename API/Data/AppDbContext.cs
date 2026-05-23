using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

/// <summary>
/// Inherits from IdentityDbContext so ASP.NET Identity tables (Users, Roles, Claims, etc.)
/// are automatically included in the schema. We pass AppUser and Guid so Identity
/// uses our custom user class and Guid PKs instead of the default string PKs.
/// </summary>
public class AppDbContext : IdentityDbContext<AppUser, IdentityRole<Guid>, Guid>
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Listing> Listings => Set<Listing>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<ListingImage> ListingImages => Set<ListingImage>();
    public DbSet<Favorite> Favorites => Set<Favorite>();
    public DbSet<ContactRequest> ContactRequests => Set<ContactRequest>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        // IMPORTANT: must call base so Identity tables get configured correctly
        base.OnModelCreating(builder);

        // ── AppUser ────────────────────────────────────────────────────────────
        builder.Entity<AppUser>(e =>
        {
            e.Property(u => u.CreatedAt).IsRequired();
            e.Property(u => u.IsActive).HasDefaultValue(true);
        });

        // ── Category (self-referential) ────────────────────────────────────────
        builder.Entity<Category>(e =>
        {
            e.HasKey(c => c.Id);
            e.Property(c => c.Name).HasMaxLength(100).IsRequired();
            e.Property(c => c.Slug).HasMaxLength(100).IsRequired();
            e.HasIndex(c => c.Slug).IsUnique();

            // Self-referential: many Children → one Parent
            e.HasOne(c => c.Parent)
             .WithMany(c => c.Children)
             .HasForeignKey(c => c.ParentId)
             .OnDelete(DeleteBehavior.Restrict);  // don't cascade delete parent
        });

        // ── Listing ────────────────────────────────────────────────────────────
        builder.Entity<Listing>(e =>
        {
            e.HasKey(l => l.Id);
            e.Property(l => l.Title).HasMaxLength(100).IsRequired();
            e.Property(l => l.Description).HasMaxLength(2000).IsRequired();
            e.Property(l => l.Price).HasColumnType("decimal(18,2)").IsRequired();
            e.Property(l => l.City).HasMaxLength(100).IsRequired();

            // Store enum as string for human-readable DB values
            e.Property(l => l.Status)
             .HasConversion<string>()
             .HasMaxLength(20);

            e.HasOne(l => l.User)
             .WithMany(u => u.Listings)
             .HasForeignKey(l => l.UserId)
             .OnDelete(DeleteBehavior.Cascade);  // delete user → delete their listings

            e.HasOne(l => l.Category)
             .WithMany(c => c.Listings)
             .HasForeignKey(l => l.CategoryId)
             .OnDelete(DeleteBehavior.Restrict);  // protect categories from cascade

            // Index for common query patterns
            e.HasIndex(l => l.Status);
            e.HasIndex(l => l.CategoryId);
            e.HasIndex(l => l.UserId);
        });

        // ── ListingImage ───────────────────────────────────────────────────────
        builder.Entity<ListingImage>(e =>
        {
            e.HasKey(i => i.Id);
            e.Property(i => i.ImageUrl).IsRequired();
            e.Property(i => i.PublicId).IsRequired();

            e.HasOne(i => i.Listing)
             .WithMany(l => l.Images)
             .HasForeignKey(i => i.ListingId)
             .OnDelete(DeleteBehavior.Cascade);  // delete listing → delete its images
        });

        // ── Favorite ───────────────────────────────────────────────────────────
        builder.Entity<Favorite>(e =>
        {
            e.HasKey(f => f.Id);

            // Unique constraint: a user can't favorite the same listing twice
            e.HasIndex(f => new { f.UserId, f.ListingId }).IsUnique();

            e.HasOne(f => f.User)
             .WithMany(u => u.Favorites)
             .HasForeignKey(f => f.UserId)
             .OnDelete(DeleteBehavior.Cascade);

            e.HasOne(f => f.Listing)
             .WithMany(l => l.Favorites)
             .HasForeignKey(f => f.ListingId)
             .OnDelete(DeleteBehavior.Cascade);
        });

        // ── ContactRequest ─────────────────────────────────────────────────────
        builder.Entity<ContactRequest>(e =>
        {
            e.HasKey(c => c.Id);
            e.Property(c => c.SenderName).HasMaxLength(100).IsRequired();
            e.Property(c => c.SenderEmail).HasMaxLength(200).IsRequired();
            e.Property(c => c.SenderPhone).HasMaxLength(50);
            e.Property(c => c.Message).HasMaxLength(1000).IsRequired();

            e.HasOne(c => c.Listing)
             .WithMany(l => l.ContactRequests)
             .HasForeignKey(c => c.ListingId)
             .OnDelete(DeleteBehavior.Cascade);
        });
    }
}

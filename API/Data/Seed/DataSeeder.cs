using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace API.Data.Seed;

/// <summary>
/// Runs at app startup if the DB is empty. Seeds:
/// 1. Roles (Admin, Member)
/// 2. Categories (top-level + subcategories)
/// 3. Admin user
///
/// Using HasDataAsync pattern (check-before-insert) makes this idempotent —
/// safe to call on every startup without creating duplicates.
/// </summary>
public static class DataSeeder
{
    public static async Task SeedAsync(
        AppDbContext context,
        UserManager<AppUser> userManager,
        RoleManager<IdentityRole<Guid>> roleManager)
    {
        await SeedRolesAsync(roleManager);
        await SeedCategoriesAsync(context);
        await SeedAdminUserAsync(userManager);
    }

    private static async Task SeedRolesAsync(RoleManager<IdentityRole<Guid>> roleManager)
    {
        string[] roles = ["Admin", "Member"];

        foreach (var role in roles)
        {
            if (!await roleManager.RoleExistsAsync(role))
                await roleManager.CreateAsync(new IdentityRole<Guid>(role));
        }
    }

    private static async Task SeedCategoriesAsync(AppDbContext context)
    {
        if (await context.Categories.AnyAsync()) return;

        // Top-level categories
        var categories = new List<Category>
        {
            new() { Id = Guid.NewGuid(), Name = "Electronics", Slug = "electronics" },
            new() { Id = Guid.NewGuid(), Name = "Cars & Vehicles", Slug = "cars-vehicles" },
            new() { Id = Guid.NewGuid(), Name = "Real Estate", Slug = "real-estate" },
            new() { Id = Guid.NewGuid(), Name = "Clothing & Fashion", Slug = "clothing-fashion" },
            new() { Id = Guid.NewGuid(), Name = "Home & Garden", Slug = "home-garden" },
            new() { Id = Guid.NewGuid(), Name = "Sports & Leisure", Slug = "sports-leisure" },
            new() { Id = Guid.NewGuid(), Name = "Books & Education", Slug = "books-education" },
            new() { Id = Guid.NewGuid(), Name = "Jobs & Services", Slug = "jobs-services" },
            new() { Id = Guid.NewGuid(), Name = "Animals & Pets", Slug = "animals-pets" },
            new() { Id = Guid.NewGuid(), Name = "Kids & Babies", Slug = "kids-babies" },
            new() { Id = Guid.NewGuid(), Name = "Antiques & Art", Slug = "antiques-art" },
            new() { Id = Guid.NewGuid(), Name = "Other", Slug = "other" },
        };

        await context.Categories.AddRangeAsync(categories);
        await context.SaveChangesAsync();

        // Sub-categories (Electronics)
        var electronics = categories.First(c => c.Slug == "electronics");
        var subCategories = new List<Category>
        {
            new() { Id = Guid.NewGuid(), Name = "Phones & Tablets", Slug = "phones-tablets", ParentId = electronics.Id },
            new() { Id = Guid.NewGuid(), Name = "Laptops & Computers", Slug = "laptops-computers", ParentId = electronics.Id },
            new() { Id = Guid.NewGuid(), Name = "TV & Audio", Slug = "tv-audio", ParentId = electronics.Id },
            new() { Id = Guid.NewGuid(), Name = "Cameras & Photography", Slug = "cameras-photography", ParentId = electronics.Id },
        };

        // Sub-categories (Cars)
        var cars = categories.First(c => c.Slug == "cars-vehicles");
        subCategories.AddRange(new[]
        {
            new Category { Id = Guid.NewGuid(), Name = "Cars", Slug = "cars", ParentId = cars.Id },
            new Category { Id = Guid.NewGuid(), Name = "Motorcycles", Slug = "motorcycles", ParentId = cars.Id },
            new Category { Id = Guid.NewGuid(), Name = "Trucks & Vans", Slug = "trucks-vans", ParentId = cars.Id },
        });

        await context.Categories.AddRangeAsync(subCategories);
        await context.SaveChangesAsync();
    }

    private static async Task SeedAdminUserAsync(UserManager<AppUser> userManager)
    {
        const string adminEmail = "admin@marketplace.com";

        if (await userManager.FindByEmailAsync(adminEmail) != null) return;

        var admin = new AppUser
        {
            UserName = "admin",
            Email = adminEmail,
            City = "București",
            EmailConfirmed = true,
            IsActive = true,
        };

        // ⚠️ Change this in production! Use dotnet user-secrets for the real password.
        var result = await userManager.CreateAsync(admin, "Admin@123456");

        if (result.Succeeded)
            await userManager.AddToRoleAsync(admin, "Admin");
        else
            throw new Exception($"Failed to seed admin: {string.Join(", ", result.Errors.Select(e => e.Description))}");
    }
}

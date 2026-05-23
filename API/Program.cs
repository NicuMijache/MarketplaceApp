using API.Data;
using API.Data.Seed;
using API.Entities;
using API.Extensions;
using API.Middleware;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// ── Register Services ──────────────────────────────────────────────────────────
builder.Services.AddControllers();
builder.Services.AddApplicationServices(builder.Configuration);
builder.Services.AddIdentityServices(builder.Configuration);
builder.Services.AddSwaggerWithAuth();

// ── Build App ──────────────────────────────────────────────────────────────────
var app = builder.Build();

// ── Middleware Pipeline (ORDER MATTERS) ────────────────────────────────────────
// 1. Global exception handler — must be FIRST to catch errors from all other middleware
app.UseMiddleware<ExceptionMiddleware>();

// 2. Swagger — dev only
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// 3. HTTPS redirect
app.UseHttpsRedirection();

// 4. CORS — must be before Auth
app.UseCors("CorsPolicy");

// 5. Authentication (validate JWT) — before Authorization
app.UseAuthentication();

// 6. Authorization (enforce [Authorize] attributes)
app.UseAuthorization();

// 7. Map controller routes
app.MapControllers();

// ── Seed Database on Startup ───────────────────────────────────────────────────
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<AppDbContext>();
        var userManager = services.GetRequiredService<UserManager<AppUser>>();
        var roleManager = services.GetRequiredService<RoleManager<IdentityRole<Guid>>>();

        // Apply pending migrations automatically on startup
        await context.Database.MigrateAsync();

        // Seed roles, categories, and admin user
        await DataSeeder.SeedAsync(context, userManager, roleManager);
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred during DB migration/seeding");
    }
}

app.Run();

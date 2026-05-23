using System.Text;
using API.Data;
using API.Data.Repositories;
using API.Data.UnitOfWork;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using API.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

namespace API.Extensions;

/// <summary>
/// Extension methods on IServiceCollection to keep Program.cs clean.
/// Groups related registrations: DB, Identity, Auth, App services, Swagger.
/// Each group is one method — easy to read, easy to disable if needed.
/// </summary>
public static class ApplicationServiceExtensions
{
    public static IServiceCollection AddApplicationServices(
        this IServiceCollection services, IConfiguration config)
    {
        // ── Database ───────────────────────────────────────────────────────────
        services.AddDbContext<AppDbContext>(options =>
            options.UseNpgsql(config.GetConnectionString("DefaultConnection")));

        // ── Repositories + Unit of Work (Scoped = one per HTTP request) ───────
        services.AddScoped<IUnitOfWork, UnitOfWork>();
        services.AddScoped<IListingRepository, ListingRepository>();
        services.AddScoped<IUserRepository, UserRepository>();

        // ── Domain Services ────────────────────────────────────────────────────
        services.AddScoped<ITokenService, TokenService>();
        services.AddScoped<IPhotoService, PhotoService>();
        services.AddScoped<IEmailService, EmailService>();

        // ── AutoMapper: scans the assembly for all Profile subclasses ──────────
        services.AddAutoMapper(typeof(MappingProfiles).Assembly);

        // ── CORS: allow Angular dev server ─────────────────────────────────────
        services.AddCors(options =>
        {
            options.AddPolicy("CorsPolicy", policy =>
            {
                policy
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                    .WithOrigins(
                        "http://localhost:4200",   // Angular dev server
                        "https://localhost:4200"
                    );
            });
        });

        return services;
    }

    public static IServiceCollection AddIdentityServices(
        this IServiceCollection services, IConfiguration config)
    {
        // ── ASP.NET Core Identity ──────────────────────────────────────────────
        services.AddIdentityCore<AppUser>(options =>
        {
            // Relaxed password rules for dev — tighten for production
            options.Password.RequireNonAlphanumeric = true;
            options.Password.RequireUppercase = true;
            options.Password.RequireLowercase = true;
            options.Password.RequireDigit = true;
            options.Password.RequiredLength = 8;

            options.User.RequireUniqueEmail = true;
        })
        .AddRoles<IdentityRole<Guid>>()
        .AddRoleManager<RoleManager<IdentityRole<Guid>>>()
        .AddSignInManager<SignInManager<AppUser>>()
        .AddEntityFrameworkStores<AppDbContext>();

        // ── JWT Bearer Authentication ──────────────────────────────────────────
        var tokenKey = config["TokenKey"]
            ?? throw new InvalidOperationException("TokenKey not configured in user-secrets or appsettings");

        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(tokenKey)),
                    ValidateIssuer = false,   // single-server app — no issuer
                    ValidateAudience = false,  // single-server app — no audience
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero  // exact expiry, no grace period
                };
            });

        services.AddAuthorization();

        return services;
    }

    public static IServiceCollection AddSwaggerWithAuth(this IServiceCollection services)
    {
        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen(options =>
        {
            options.SwaggerDoc("v1", new OpenApiInfo
            {
                Title = "Marketplace API",
                Version = "v1",
                Description = "Classifieds & Reselling API"
            });

            // Add JWT auth to Swagger UI so we can test protected endpoints
            options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
            {
                Description = "JWT Authorization header. Enter: Bearer {your_token}",
                Name = "Authorization",
                In = ParameterLocation.Header,
                Type = SecuritySchemeType.ApiKey,
                Scheme = "Bearer"
            });

            options.AddSecurityRequirement(new OpenApiSecurityRequirement
            {
                {
                    new OpenApiSecurityScheme
                    {
                        Reference = new OpenApiReference
                        {
                            Type = ReferenceType.SecurityScheme,
                            Id = "Bearer"
                        }
                    },
                    Array.Empty<string>()
                }
            });
        });

        return services;
    }
}

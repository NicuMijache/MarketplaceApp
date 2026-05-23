# Marketplace App — Project Context for Claude Code

## Overview
A classifieds/reselling web application (similar to OLX) built with **ASP.NET Core 8** (backend) and **Angular 17** (frontend). Users can register, post listings with photos, browse and filter ads, save favorites, and contact sellers via email (bot-sent, SendGrid).

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | ASP.NET Core 8 Web API |
| ORM | Entity Framework Core 8 |
| Database | PostgreSQL |
| Auth | ASP.NET Core Identity + JWT Bearer |
| Object mapping | AutoMapper |
| Validation | FluentValidation |
| Image storage | Cloudinary |
| Email | SendGrid |
| Frontend | Angular 17 (standalone components) |
| Styling | Tailwind CSS |
| HTTP | Angular HttpClient with JWT interceptor |

---

## Architecture Pattern
- **Repository Pattern** — each entity has its own repository interface + implementation
- **Unit of Work** — single `IUnitOfWork` wraps all repositories, one `SaveChangesAsync()` per request
- **Service Layer** — business logic lives in Services, not Controllers
- **DTOs** — all API responses use DTOs (never expose raw EF entities), mapped via AutoMapper
- **Global Exception Middleware** — catches all unhandled exceptions, returns consistent error responses

---

## Database Schema

### Users
| Column | Type | Notes |
|---|---|---|
| Id | uuid (PK) | |
| Username | string | unique |
| Email | string | unique |
| PasswordHash | string | managed by ASP.NET Identity |
| PhoneNumber | string | nullable |
| City | string | nullable |
| ProfilePicture | string | Cloudinary URL, nullable |
| CreatedAt | datetime | |
| IsActive | bool | default true |

### Listings
| Column | Type | Notes |
|---|---|---|
| Id | uuid (PK) | |
| UserId | uuid (FK → Users) | |
| CategoryId | uuid (FK → Categories) | |
| Title | string | max 100 chars |
| Description | string | max 2000 chars |
| Price | decimal | |
| City | string | |
| Status | string | enum: Active, Sold, Paused |
| IsNegotiable | bool | |
| CreatedAt | datetime | |
| UpdatedAt | datetime | |

### Categories
| Column | Type | Notes |
|---|---|---|
| Id | uuid (PK) | |
| Name | string | |
| Slug | string | unique, URL-friendly |
| ParentId | uuid (FK → Categories) | nullable, for subcategories |

### ListingImages
| Column | Type | Notes |
|---|---|---|
| Id | uuid (PK) | |
| ListingId | uuid (FK → Listings) | |
| ImageUrl | string | Cloudinary URL |
| PublicId | string | Cloudinary public_id for deletion |
| IsMain | bool | |
| Order | int | display order |

### Favorites
| Column | Type | Notes |
|---|---|---|
| Id | uuid (PK) | |
| UserId | uuid (FK → Users) | |
| ListingId | uuid (FK → Listings) | |
| SavedAt | datetime | |

### ContactRequests
| Column | Type | Notes |
|---|---|---|
| Id | uuid (PK) | |
| ListingId | uuid (FK → Listings) | |
| SenderName | string | |
| SenderEmail | string | |
| SenderPhone | string | nullable |
| Message | string | max 1000 chars |
| SentAt | datetime | |

---

## API Routes

### Account — `/api/account`
| Method | Route | Description | Auth |
|---|---|---|---|
| POST | /api/account/register | Register new user | Public |
| POST | /api/account/login | Login → returns JWT | Public |
| GET | /api/account/me | Get current user profile | 🔒 JWT |
| PUT | /api/account/me | Update profile | 🔒 JWT |

### Listings — `/api/listings`
| Method | Route | Description | Auth |
|---|---|---|---|
| GET | /api/listings | Get all listings (filters + pagination) | Public |
| GET | /api/listings/{id} | Get listing details | Public |
| GET | /api/listings/my | Get my listings | 🔒 JWT |
| POST | /api/listings | Create new listing | 🔒 JWT |
| PUT | /api/listings/{id} | Edit listing | 🔒 JWT |
| DELETE | /api/listings/{id} | Delete listing | 🔒 JWT |
| PUT | /api/listings/{id}/status | Change status (Active/Sold/Paused) | 🔒 JWT |

### Listing Images — `/api/listings/{id}/images`
| Method | Route | Description | Auth |
|---|---|---|---|
| POST | /api/listings/{id}/images | Upload image → Cloudinary | 🔒 JWT |
| DELETE | /api/listings/{id}/images/{imgId} | Delete image | 🔒 JWT |
| PUT | /api/listings/{id}/images/{imgId}/main | Set as main image | 🔒 JWT |

### Categories — `/api/categories`
| Method | Route | Description | Auth |
|---|---|---|---|
| GET | /api/categories | Get all categories | Public |
| GET | /api/categories/{id}/listings | Get listings in category | Public |

### Favorites — `/api/favorites`
| Method | Route | Description | Auth |
|---|---|---|---|
| GET | /api/favorites | Get my saved listings | 🔒 JWT |
| POST | /api/favorites/{listingId} | Save / toggle favorite | 🔒 JWT |
| DELETE | /api/favorites/{listingId} | Remove from favorites | 🔒 JWT |

### Contact — `/api/contact`
| Method | Route | Description | Auth |
|---|---|---|---|
| POST | /api/contact/{listingId} | Send contact request | Public |
| GET | /api/contact/received | View received messages (as seller) | 🔒 JWT |

**Contact flow:** Buyer fills form → POST saves to `ContactRequests` table → SendGrid sends HTML email to seller's address from `noreply@appname.com`. Email contains: buyer name, email, phone, message text, link to listing.

### Admin — `/api/admin`
| Method | Route | Description | Auth |
|---|---|---|---|
| GET | /api/admin/listings | All listings (moderation) | 🔒 Admin role |
| PUT | /api/admin/listings/{id} | Approve / reject listing | 🔒 Admin role |
| GET | /api/admin/users | All users | 🔒 Admin role |
| DELETE | /api/admin/users/{id} | Ban user | 🔒 Admin role |

---

## Project Folder Structure

```
/
├── API/                              # ASP.NET Core 8 project
│   ├── Controllers/
│   │   ├── AccountController.cs
│   │   ├── ListingsController.cs
│   │   ├── CategoriesController.cs
│   │   ├── FavoritesController.cs
│   │   ├── ContactController.cs
│   │   └── AdminController.cs
│   ├── Data/
│   │   ├── AppDbContext.cs
│   │   ├── Repositories/
│   │   │   ├── IListingRepository.cs
│   │   │   ├── ListingRepository.cs
│   │   │   ├── IUserRepository.cs
│   │   │   └── UserRepository.cs
│   │   ├── UnitOfWork/
│   │   │   ├── IUnitOfWork.cs
│   │   │   └── UnitOfWork.cs
│   │   └── Seed/
│   │       └── DataSeeder.cs        # seed categories + admin user
│   ├── DTOs/
│   │   ├── Account/
│   │   ├── Listings/
│   │   ├── Contact/
│   │   └── Shared/
│   │       └── PaginatedResult.cs
│   ├── Entities/
│   │   ├── AppUser.cs
│   │   ├── Listing.cs
│   │   ├── Category.cs
│   │   ├── ListingImage.cs
│   │   ├── Favorite.cs
│   │   └── ContactRequest.cs
│   ├── Extensions/
│   │   └── ApplicationServiceExtensions.cs
│   ├── Helpers/
│   │   ├── MappingProfiles.cs       # AutoMapper
│   │   ├── PaginationParams.cs
│   │   └── ListingFilterParams.cs
│   ├── Interfaces/
│   │   ├── ITokenService.cs
│   │   ├── IPhotoService.cs         # Cloudinary
│   │   └── IEmailService.cs         # SendGrid
│   ├── Middleware/
│   │   └── ExceptionMiddleware.cs
│   ├── Services/
│   │   ├── TokenService.cs
│   │   ├── PhotoService.cs
│   │   └── EmailService.cs
│   ├── appsettings.json
│   └── Program.cs
│
├── client/                           # Angular 17 project
│   └── src/app/
│       ├── _models/
│       ├── _services/
│       ├── _guards/
│       ├── _interceptors/
│       ├── core/
│       │   ├── navbar/
│       │   └── footer/
│       ├── features/
│       │   ├── auth/
│       │   │   ├── login/
│       │   │   └── register/
│       │   ├── listings/
│       │   │   ├── listing-list/
│       │   │   ├── listing-detail/
│       │   │   ├── listing-create/
│       │   │   └── listing-edit/
│       │   ├── favorites/
│       │   ├── profile/
│       │   └── admin/
│       └── shared/
│           ├── components/
│           └── pipes/
│
├── PROJECT_CONTEXT.md               # this file
└── MarketplaceApp.sln
```

---

## Key Implementation Notes

### JWT Auth flow
1. User POSTs credentials to `/api/account/login`
2. Backend validates, returns `{ token: "...", username: "...", ... }`
3. Angular stores token in `localStorage`
4. `JwtInterceptor` attaches `Authorization: Bearer <token>` to every request
5. `AuthGuard` blocks routes that require login

### SendGrid email (contact flow)
- Use `SendGrid` NuGet package
- `IEmailService` interface with `SendContactEmailAsync(ContactEmailDto dto)`
- HTML email template includes: buyer info, message, link to listing
- API key stored in `appsettings.json` → `SendGrid:ApiKey` (never commit real keys, use dotnet user-secrets)

### Cloudinary image upload
- Use `CloudinaryDotNet` NuGet package
- `IPhotoService` interface with `AddPhotoAsync` and `DeletePhotoAsync`
- Store both `ImageUrl` and `PublicId` in DB (PublicId needed for deletion)

### Pagination
- All list endpoints accept `?pageNumber=1&pageSize=10`
- Backend returns `PaginatedResult<T>` with metadata in response body
- Filter params for listings: `?city=Cluj&categoryId=...&minPrice=100&maxPrice=500&search=iphone`

### Seeded data
On first run, seed: 10-15 categories (Electronics, Cars, Clothes, etc.) and one admin user.

---

## Environment / Config Keys needed
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=...;Database=...;Username=...;Password=..."
  },
  "TokenKey": "your-super-secret-jwt-key-min-64-chars",
  "CloudinarySettings": {
    "CloudName": "",
    "ApiKey": "",
    "ApiSecret": ""
  },
  "SendGrid": {
    "ApiKey": "",
    "FromEmail": "noreply@yourapp.com",
    "FromName": "Marketplace App"
  }
}
```


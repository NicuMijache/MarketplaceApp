using API.DTOs.Account;
using API.DTOs.Contact;
using API.DTOs.Listings;
using API.Entities;
using AutoMapper;

namespace API.Helpers;

/// <summary>
/// AutoMapper profiles define how entity → DTO conversions work.
///
/// WHY AutoMapper: Eliminates repetitive property-copy code and
/// ensures we never accidentally expose an entity field we didn't intend to.
/// Any property with a different name needs explicit mapping (see below).
///
/// The UserDto.Token field is NOT mapped here (it's set manually in the controller
/// after token generation, since mapping doesn't know the JWT).
/// </summary>
public class MappingProfiles : Profile
{
    public MappingProfiles()
    {
        // ── User mappings ──────────────────────────────────────────────────────
        CreateMap<AppUser, UserDto>()
            .ForMember(d => d.Token, opt => opt.Ignore());  // set manually after login

        // ── Category mappings ──────────────────────────────────────────────────
        CreateMap<Category, CategoryDto>();

        // ── Listing → ListingDto (detail view) ────────────────────────────────
        CreateMap<Listing, ListingDto>()
            .ForMember(d => d.CategoryName, opt => opt.MapFrom(s => s.Category.Name))
            .ForMember(d => d.Seller, opt => opt.MapFrom(s => s.User))
            .ForMember(d => d.MainImageUrl, opt => opt.MapFrom(
                s => s.Images.FirstOrDefault(i => i.IsMain) != null
                    ? s.Images.First(i => i.IsMain).ImageUrl
                    : s.Images.OrderBy(i => i.Order).FirstOrDefault() != null
                        ? s.Images.OrderBy(i => i.Order).First().ImageUrl
                        : null))
            .ForMember(d => d.IsFavoritedByCurrentUser, opt => opt.Ignore()); // set in service

        // ── Listing → ListingCardDto (grid / search results) ──────────────────
        CreateMap<Listing, ListingCardDto>()
            .ForMember(d => d.CategoryName, opt => opt.MapFrom(s => s.Category.Name))
            .ForMember(d => d.SellerUsername, opt => opt.MapFrom(s => s.User.UserName))
            .ForMember(d => d.MainImageUrl, opt => opt.MapFrom(
                s => s.Images.FirstOrDefault(i => i.IsMain) != null
                    ? s.Images.First(i => i.IsMain).ImageUrl
                    : s.Images.OrderBy(i => i.Order).FirstOrDefault() != null
                        ? s.Images.OrderBy(i => i.Order).First().ImageUrl
                        : null));

        // ── ListingImage → ListingImageDto ────────────────────────────────────
        CreateMap<ListingImage, ListingImageDto>();

        // ── AppUser → SellerDto (nested inside ListingDto) ────────────────────
        CreateMap<AppUser, SellerDto>()
            .ForMember(d => d.Username, opt => opt.MapFrom(s => s.UserName));

        // ── ContactRequest mappings ────────────────────────────────────────────
        CreateMap<ContactRequest, ContactRequestDto>()
            .ForMember(d => d.ListingTitle, opt => opt.MapFrom(s => s.Listing.Title));

        CreateMap<CreateContactRequestDto, ContactRequest>();

        // ── Listing create/update ──────────────────────────────────────────────
        CreateMap<CreateListingDto, Listing>();
    }
}

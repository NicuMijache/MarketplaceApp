using API.Entities;

namespace API.Interfaces;

/// <summary>
/// Generates a signed JWT for a given user.
/// The implementation reads the secret key from configuration — never hardcode.
/// Keeping this as an interface makes it trivially mockable in unit tests.
/// </summary>
public interface ITokenService
{
    Task<string> CreateTokenAsync(AppUser user);
}

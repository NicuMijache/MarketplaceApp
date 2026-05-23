using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;

namespace API.Services;

/// <summary>
/// Creates a signed JWT containing the user's ID, username, email and roles.
///
/// JWT anatomy:
///   Header.Payload.Signature
///   - Header: algorithm (HS512)
///   - Payload: claims (sub, name, email, role, exp)
///   - Signature: HMAC-SHA512 of Header+Payload using our secret key
///
/// The key MUST be at least 64 characters for HS512. Store it in user-secrets:
///   dotnet user-secrets set "TokenKey" "your-64-char-secret..."
/// </summary>
public class TokenService : ITokenService
{
    private readonly IConfiguration _config;
    private readonly UserManager<AppUser> _userManager;

    public TokenService(IConfiguration config, UserManager<AppUser> userManager)
    {
        _config = config;
        _userManager = userManager;
    }

    public async Task<string> CreateTokenAsync(AppUser user)
    {
        var tokenKey = _config["TokenKey"]
            ?? throw new InvalidOperationException("TokenKey not configured");

        if (tokenKey.Length < 64)
            throw new InvalidOperationException("TokenKey must be at least 64 characters");

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(tokenKey));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

        // Claims are statements about the user embedded in the token payload
        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new(JwtRegisteredClaimNames.UniqueName, user.UserName ?? ""),
            new(JwtRegisteredClaimNames.Email, user.Email ?? ""),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),  // unique token ID
        };

        // Add role claims so [Authorize(Roles = "Admin")] works
        var roles = await _userManager.GetRolesAsync(user);
        claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddDays(7),
            SigningCredentials = creds
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }
}

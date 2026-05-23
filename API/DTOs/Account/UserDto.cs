namespace API.DTOs.Account;

/// <summary>
/// Returned after successful login OR from GET /api/account/me.
/// The JWT token is included here so Angular can store it in localStorage.
/// We never return the PasswordHash — only what the client needs.
/// </summary>
public class UserDto
{
    public Guid Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public string? City { get; set; }
    public string? ProfilePicture { get; set; }
    public DateTime CreatedAt { get; set; }
    public string Token { get; set; } = string.Empty;  // JWT — only set on login
}

namespace API.DTOs.Account;

/// <summary>
/// Input DTO for POST /api/account/register.
/// FluentValidation rules live in a separate Validator class (keeps DTOs lean).
/// </summary>
public class RegisterDto
{
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public string? City { get; set; }
}

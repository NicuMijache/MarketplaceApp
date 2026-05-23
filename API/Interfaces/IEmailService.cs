namespace API.Interfaces;

/// <summary>
/// Thin wrapper around SendGrid. All email sending goes through here.
/// Having an interface means we can swap SendGrid for another provider
/// without touching any business logic.
/// </summary>
public interface IEmailService
{
    Task SendContactEmailAsync(
        string toEmail,
        string toName,
        string senderName,
        string senderEmail,
        string? senderPhone,
        string message,
        string listingTitle,
        string listingUrl
    );
}

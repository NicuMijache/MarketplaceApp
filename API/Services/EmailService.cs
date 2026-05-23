using API.Interfaces;
using SendGrid;
using SendGrid.Helpers.Mail;

namespace API.Services;

/// <summary>
/// Sends transactional emails via SendGrid.
///
/// The contact email flow:
/// 1. Buyer submits form → ContactController saves to DB
/// 2. ContactController calls EmailService.SendContactEmailAsync
/// 3. SendGrid delivers the HTML email to the seller
///
/// Using HTML template here instead of dynamic templates (SendGrid feature)
/// keeps everything in code and avoids vendor lock-in for the template UI.
/// </summary>
public class EmailService : IEmailService
{
    private readonly IConfiguration _config;
    private readonly ILogger<EmailService> _logger;

    public EmailService(IConfiguration config, ILogger<EmailService> logger)
    {
        _config = config;
        _logger = logger;
    }

    public async Task SendContactEmailAsync(
        string toEmail,
        string toName,
        string senderName,
        string senderEmail,
        string? senderPhone,
        string message,
        string listingTitle,
        string listingUrl)
    {
        var apiKey = _config["SendGrid:ApiKey"]
            ?? throw new InvalidOperationException("SendGrid:ApiKey not configured");
        var fromEmail = _config["SendGrid:FromEmail"] ?? "noreply@marketplaceapp.com";
        var fromName = _config["SendGrid:FromName"] ?? "Marketplace App";

        var client = new SendGridClient(apiKey);
        var from = new EmailAddress(fromEmail, fromName);
        var to = new EmailAddress(toEmail, toName);
        var subject = $"[Marketplace] New message about: {listingTitle}";

        var htmlContent = BuildContactEmailHtml(
            toName, senderName, senderEmail, senderPhone, message, listingTitle, listingUrl);
        var plainContent = BuildContactEmailPlain(
            senderName, senderEmail, senderPhone, message, listingTitle, listingUrl);

        var msg = MailHelper.CreateSingleEmail(from, to, subject, plainContent, htmlContent);
        // Reply-To the sender so seller can reply directly
        msg.ReplyTo = new EmailAddress(senderEmail, senderName);

        var response = await client.SendEmailAsync(msg);

        if (!response.IsSuccessStatusCode)
        {
            var body = await response.Body.ReadAsStringAsync();
            _logger.LogError("SendGrid error {StatusCode}: {Body}", response.StatusCode, body);
            throw new Exception($"Email sending failed: {response.StatusCode}");
        }
    }

    private static string BuildContactEmailHtml(
        string sellerName, string senderName, string senderEmail,
        string? senderPhone, string message, string listingTitle, string listingUrl)
    {
        return $"""
        <!DOCTYPE html>
        <html>
        <head><meta charset="UTF-8"></head>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #3B82F6; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0;">Marketplace App</h1>
            <p style="margin: 5px 0 0;">New message about your listing</p>
          </div>
          <div style="background: #f9f9f9; padding: 20px; border: 1px solid #e0e0e0;">
            <p>Hi <strong>{sellerName}</strong>,</p>
            <p>Someone is interested in your listing: <strong><a href="{listingUrl}">{listingTitle}</a></strong></p>

            <div style="background: white; border-left: 4px solid #3B82F6; padding: 15px; margin: 20px 0;">
              <p style="margin: 0; font-style: italic;">"{message}"</p>
            </div>

            <h3>Contact details:</h3>
            <table style="border-collapse: collapse; width: 100%;">
              <tr><td style="padding: 8px; font-weight: bold;">Name</td><td style="padding: 8px;">{senderName}</td></tr>
              <tr><td style="padding: 8px; font-weight: bold;">Email</td><td style="padding: 8px;"><a href="mailto:{senderEmail}">{senderEmail}</a></td></tr>
              {(senderPhone != null ? $"<tr><td style=\"padding: 8px; font-weight: bold;\">Phone</td><td style=\"padding: 8px;\">{senderPhone}</td></tr>" : "")}
            </table>
          </div>
          <div style="background: #f0f0f0; padding: 15px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; color: #666;">
            <p>You received this because someone contacted you via Marketplace App.</p>
            <p>Reply directly to <strong>{senderEmail}</strong> to respond.</p>
          </div>
        </body>
        </html>
        """;
    }

    private static string BuildContactEmailPlain(
        string senderName, string senderEmail, string? senderPhone,
        string message, string listingTitle, string listingUrl)
    {
        return $"""
        New contact request for listing: {listingTitle}
        Link: {listingUrl}

        Message: {message}

        From: {senderName}
        Email: {senderEmail}
        {(senderPhone != null ? $"Phone: {senderPhone}" : "")}
        """;
    }
}

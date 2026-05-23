namespace API.Entities;

/// <summary>
/// Persists every contact attempt so the seller can see their inbox
/// (GET /api/contact/received). SendGrid sends the email async after save.
/// SenderPhone is nullable — buyers may not want to share it.
/// </summary>
public class ContactRequest
{
    public Guid Id { get; set; }

    public Guid ListingId { get; set; }
    public Listing Listing { get; set; } = null!;

    public string SenderName { get; set; } = string.Empty;
    public string SenderEmail { get; set; } = string.Empty;
    public string? SenderPhone { get; set; }
    public string Message { get; set; } = string.Empty;   // max 1000
    public DateTime SentAt { get; set; } = DateTime.UtcNow;
}

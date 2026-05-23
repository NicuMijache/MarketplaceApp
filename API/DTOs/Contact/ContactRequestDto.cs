namespace API.DTOs.Contact;

/// <summary>
/// Returned to the seller when they view received messages.
/// Includes listing title so the seller knows which ad the message is about.
/// </summary>
public class ContactRequestDto
{
    public Guid Id { get; set; }
    public Guid ListingId { get; set; }
    public string ListingTitle { get; set; } = string.Empty;
    public string SenderName { get; set; } = string.Empty;
    public string SenderEmail { get; set; } = string.Empty;
    public string? SenderPhone { get; set; }
    public string Message { get; set; } = string.Empty;
    public DateTime SentAt { get; set; }
}

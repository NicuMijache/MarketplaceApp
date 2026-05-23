export interface CreateContactRequest {
  senderName: string;
  senderEmail: string;
  senderPhone?: string;
  message: string;
}

export interface ContactRequest {
  id: string;
  listingId: string;
  listingTitle: string;
  senderName: string;
  senderEmail: string;
  senderPhone?: string;
  message: string;
  sentAt: Date;
}

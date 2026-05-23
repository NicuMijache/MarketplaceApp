import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateContactRequest, ContactRequest } from '../_models/contact.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ContactService {
  private baseUrl = environment.apiUrl + '/contact';

  constructor(private http: HttpClient) {}

  sendContactRequest(listingId: string, dto: CreateContactRequest): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.baseUrl}/${listingId}`, dto);
  }

  getReceivedMessages(): Observable<ContactRequest[]> {
    return this.http.get<ContactRequest[]>(`${this.baseUrl}/received`);
  }
}

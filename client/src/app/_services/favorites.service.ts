import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ListingCard } from '../_models/listing.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private baseUrl = environment.apiUrl + '/favorites';

  constructor(private http: HttpClient) {}

  getFavorites(): Observable<ListingCard[]> {
    return this.http.get<ListingCard[]>(this.baseUrl);
  }

  addFavorite(listingId: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${listingId}`, {});
  }

  removeFavorite(listingId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${listingId}`);
  }
}

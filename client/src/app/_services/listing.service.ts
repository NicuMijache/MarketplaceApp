import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Listing, ListingCard, CreateListingRequest,
  UpdateListingRequest, UpdateStatusRequest, ListingImage
} from '../_models/listing.model';
import { PaginatedResult, ListingFilterParams } from '../_models/pagination.model';
import { environment } from '../../environments/environment';

/**
 * ListingService handles all API calls for listings.
 * Using HttpParams to build query strings cleanly — avoids manual string concatenation.
 */
@Injectable({ providedIn: 'root' })
export class ListingService {
  private baseUrl = environment.apiUrl + '/listings';

  constructor(private http: HttpClient) {}

  getListings(filters: ListingFilterParams = {}): Observable<PaginatedResult<ListingCard>> {
    let params = new HttpParams();
    if (filters.pageNumber)  params = params.set('pageNumber', filters.pageNumber);
    if (filters.pageSize)    params = params.set('pageSize', filters.pageSize);
    if (filters.search)      params = params.set('search', filters.search);
    if (filters.city)        params = params.set('city', filters.city);
    if (filters.categoryId)  params = params.set('categoryId', filters.categoryId);
    if (filters.minPrice != null) params = params.set('minPrice', filters.minPrice);
    if (filters.maxPrice != null) params = params.set('maxPrice', filters.maxPrice);
    if (filters.status)      params = params.set('status', filters.status);
    if (filters.orderBy)     params = params.set('orderBy', filters.orderBy);
    return this.http.get<PaginatedResult<ListingCard>>(this.baseUrl, { params });
  }

  getListing(id: string): Observable<Listing> {
    return this.http.get<Listing>(`${this.baseUrl}/${id}`);
  }

  getMyListings(): Observable<Listing[]> {
    return this.http.get<Listing[]>(`${this.baseUrl}/my`);
  }

  createListing(dto: CreateListingRequest): Observable<Listing> {
    return this.http.post<Listing>(this.baseUrl, dto);
  }

  updateListing(id: string, dto: UpdateListingRequest): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, dto);
  }

  deleteListing(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  updateStatus(id: string, dto: UpdateStatusRequest): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}/status`, dto);
  }

  // ── Image operations ─────────────────────────────────────────────────────────

  uploadImage(listingId: string, file: File): Observable<ListingImage> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<ListingImage>(`${this.baseUrl}/${listingId}/images`, formData);
  }

  deleteImage(listingId: string, imageId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${listingId}/images/${imageId}`);
  }

  setMainImage(listingId: string, imageId: string): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${listingId}/images/${imageId}/main`, {});
  }
}

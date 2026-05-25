import { Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Listing } from '../../_models/listing.model';
import { User } from '../../_models/user.model';
import { SvgIconComponent } from '../../shared/svg-icon.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterLink, SvgIconComponent],
  templateUrl: './admin.component.html'
})
export class AdminComponent implements OnInit {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  listings: Listing[] = [];
  users: User[] = [];
  activeTab: 'listings' | 'users' = 'listings';
  loading = true;

  get activeListings(): number { return this.listings.filter(l => l.status === 'Active').length; }
  get soldListings(): number { return this.listings.filter(l => l.status === 'Sold').length; }

  ngOnInit(): void {
    this.loadListings();
  }

  loadListings(): void {
    this.loading = true;
    this.http.get<Listing[]>(`${this.baseUrl}/admin/listings`).subscribe({
      next: listings => { this.listings = listings; this.loading = false; },
      error: () => this.loading = false
    });
  }

  loadUsers(): void {
    this.loading = true;
    this.http.get<User[]>(`${this.baseUrl}/admin/users`).subscribe({
      next: users => { this.users = users; this.loading = false; },
      error: () => this.loading = false
    });
  }

  switchTab(tab: 'listings' | 'users'): void {
    this.activeTab = tab;
    if (tab === 'users' && this.users.length === 0) this.loadUsers();
    if (tab === 'listings') this.loadListings();
  }

  updateListingStatus(id: string, status: string): void {
    this.http.put(`${this.baseUrl}/admin/listings/${id}`, { status }).subscribe(() => {
      this.loadListings();
    });
  }

  banUser(id: string): void {
    if (!confirm('Ești sigur că vrei să blochezi acest utilizator?')) return;
    this.http.delete(`${this.baseUrl}/admin/users/${id}`).subscribe(() => {
      this.users = this.users.filter(u => u.id !== id);
    });
  }
}

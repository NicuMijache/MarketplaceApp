import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AccountService } from '../../_services/account.service';
import { ListingService } from '../../_services/listing.service';
import { ContactService } from '../../_services/contact.service';
import { Listing } from '../../_models/listing.model';
import { ContactRequest } from '../../_models/contact.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
  accountService = inject(AccountService);
  private listingService = inject(ListingService);
  private contactService = inject(ContactService);
  private fb = inject(FormBuilder);

  myListings: Listing[] = [];
  receivedMessages: ContactRequest[] = [];
  activeTab: 'listings' | 'messages' | 'settings' = 'listings';
  loading = false;
  updateSuccess = false;

  form: FormGroup = this.fb.group({
    phoneNumber: [''],
    city: ['']
  });

  ngOnInit(): void {
    const user = this.accountService.currentUser();
    if (user) {
      this.form.patchValue({ phoneNumber: user.phoneNumber, city: user.city });
    }
    this.loadMyListings();
  }

  loadMyListings(): void {
    this.listingService.getMyListings().subscribe(listings => this.myListings = listings);
  }

  loadMessages(): void {
    this.contactService.getReceivedMessages().subscribe(messages => this.receivedMessages = messages);
  }

  switchTab(tab: 'listings' | 'messages' | 'settings'): void {
    this.activeTab = tab;
    if (tab === 'messages' && this.receivedMessages.length === 0) this.loadMessages();
  }

  updateProfile(): void {
    this.loading = true;
    this.accountService.updateProfile(this.form.value).subscribe({
      next: () => {
        this.updateSuccess = true;
        this.loading = false;
        setTimeout(() => this.updateSuccess = false, 3000);
      },
      error: () => this.loading = false
    });
  }

  deleteListing(id: string): void {
    if (!confirm('Ești sigur că vrei să ștergi acest anunț?')) return;
    this.listingService.deleteListing(id).subscribe(() => {
      this.myListings = this.myListings.filter(l => l.id !== id);
    });
  }
}

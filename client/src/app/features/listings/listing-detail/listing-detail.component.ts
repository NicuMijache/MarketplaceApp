import { Component, OnInit, inject, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ListingService } from '../../../_services/listing.service';
import { FavoritesService } from '../../../_services/favorites.service';
import { ContactService } from '../../../_services/contact.service';
import { AccountService } from '../../../_services/account.service';
import { Listing } from '../../../_models/listing.model';
import { SvgIconComponent } from '../../../shared/svg-icon.component';

@Component({
  selector: 'app-listing-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, SvgIconComponent],
  templateUrl: './listing-detail.component.html'
})
export class ListingDetailComponent implements OnInit {
  @Input() id!: string;  // Angular 17: route param injected via withComponentInputBinding()

  private listingService = inject(ListingService);
  private favoritesService = inject(FavoritesService);
  private contactService = inject(ContactService);
  accountService = inject(AccountService);
  private fb = inject(FormBuilder);

  listing: Listing | null = null;
  loading = true;
  selectedImageIndex = 0;

  // Contact form
  contactForm: FormGroup = this.fb.group({
    senderName: ['', Validators.required],
    senderEmail: ['', [Validators.required, Validators.email]],
    senderPhone: [''],
    message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]]
  });
  contactLoading = false;
  contactSuccess = false;
  contactError = '';

  isFavorited = false;
  favoriteLoading = false;

  ngOnInit(): void {
    this.listingService.getListing(this.id).subscribe({
      next: listing => {
        this.listing = listing;
        this.isFavorited = listing.isFavoritedByCurrentUser;
        this.loading = false;

        // Pre-fill contact form with logged-in user data
        const user = this.accountService.currentUser();
        if (user) {
          this.contactForm.patchValue({
            senderName: user.username,
            senderEmail: user.email
          });
        }
      },
      error: () => this.loading = false
    });
  }

  toggleFavorite(): void {
    if (!this.accountService.isLoggedIn() || !this.listing) return;
    this.favoriteLoading = true;

    const action$ = this.isFavorited
      ? this.favoritesService.removeFavorite(this.listing.id)
      : this.favoritesService.addFavorite(this.listing.id);

    action$.subscribe({
      next: () => {
        this.isFavorited = !this.isFavorited;
        this.favoriteLoading = false;
      },
      error: () => this.favoriteLoading = false
    });
  }

  sendContactRequest(): void {
    if (this.contactForm.invalid || !this.listing) return;
    this.contactLoading = true;
    this.contactError = '';

    this.contactService.sendContactRequest(this.listing.id, this.contactForm.value).subscribe({
      next: () => {
        this.contactSuccess = true;
        this.contactLoading = false;
        this.contactForm.reset();
      },
      error: err => {
        this.contactError = err.error?.message || 'Eroare la trimiterea mesajului';
        this.contactLoading = false;
      }
    });
  }

  get isOwner(): boolean {
    return this.listing?.seller.id === this.accountService.currentUser()?.id;
  }
}

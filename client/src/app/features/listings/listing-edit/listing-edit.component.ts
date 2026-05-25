import { Component, OnInit, inject, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ListingService } from '../../../_services/listing.service';
import { CategoryService } from '../../../_services/category.service';
import { Category } from '../../../_models/category.model';
import { Listing, ListingStatus } from '../../../_models/listing.model';
import { SvgIconComponent } from '../../../shared/svg-icon.component';

@Component({
  selector: 'app-listing-edit',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink, SvgIconComponent],
  templateUrl: './listing-edit.component.html'
})
export class ListingEditComponent implements OnInit {
  @Input() id!: string;

  private fb = inject(FormBuilder);
  private listingService = inject(ListingService);
  private categoryService = inject(CategoryService);
  private router = inject(Router);

  listing: Listing | null = null;
  categories: Category[] = [];
  loading = false;
  error = '';
  success = false;
  statuses: ListingStatus[] = ['Active', 'Paused', 'Sold'];

  form: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(100)]],
    description: ['', [Validators.required, Validators.maxLength(2000)]],
    price: [null, [Validators.required, Validators.min(0)]],
    city: ['', Validators.required],
    categoryId: ['', Validators.required],
    isNegotiable: [false],
    status: ['Active']
  });

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe(cats => this.categories = cats);
    this.listingService.getListing(this.id).subscribe(listing => {
      this.listing = listing;
      this.form.patchValue(listing);
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = '';

    this.listingService.updateListing(this.id, this.form.value).subscribe({
      next: () => {
        // Also update status separately
        this.listingService.updateStatus(this.id, { status: this.form.get('status')?.value }).subscribe({
          next: () => this.router.navigate(['/listings', this.id]),
          error: () => this.router.navigate(['/listings', this.id])
        });
      },
      error: err => {
        this.error = err.error?.message || 'Eroare la actualizarea anunțului';
        this.loading = false;
      }
    });
  }

  deleteImage(imageId: string): void {
    this.listingService.deleteImage(this.id, imageId).subscribe(() => {
      if (this.listing) {
        this.listing.images = this.listing.images.filter(i => i.id !== imageId);
      }
    });
  }

  setMainImage(imageId: string): void {
    this.listingService.setMainImage(this.id, imageId).subscribe(() => {
      if (this.listing) {
        this.listing.images = this.listing.images.map(i => ({ ...i, isMain: i.id === imageId }));
      }
    });
  }

  uploadImage(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.[0]) return;
    this.listingService.uploadImage(this.id, input.files[0]).subscribe(img => {
      this.listing?.images.push(img);
    });
  }
}

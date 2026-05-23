import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ListingService } from '../../../_services/listing.service';
import { CategoryService } from '../../../_services/category.service';
import { Category } from '../../../_models/category.model';

@Component({
  selector: 'app-listing-create',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './listing-create.component.html'
})
export class ListingCreateComponent implements OnInit {
  private fb = inject(FormBuilder);
  private listingService = inject(ListingService);
  private categoryService = inject(CategoryService);
  private router = inject(Router);

  categories: Category[] = [];
  loading = false;
  error = '';
  createdListingId: string | null = null;

  // Files to upload after listing is created
  selectedFiles: File[] = [];
  previewUrls: string[] = [];

  form: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(100)]],
    description: ['', [Validators.required, Validators.maxLength(2000)]],
    price: [null, [Validators.required, Validators.min(0)]],
    city: ['', Validators.required],
    categoryId: ['', Validators.required],
    isNegotiable: [false]
  });

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe(cats => this.categories = cats);
  }

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    const newFiles = Array.from(input.files).slice(0, 10 - this.selectedFiles.length);
    this.selectedFiles.push(...newFiles);
    newFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = e => this.previewUrls.push(e.target!.result as string);
      reader.readAsDataURL(file);
    });
  }

  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1);
    this.previewUrls.splice(index, 1);
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = '';

    this.listingService.createListing(this.form.value).subscribe({
      next: listing => {
        this.createdListingId = listing.id;
        // Upload images one by one after creating the listing
        if (this.selectedFiles.length > 0) {
          this.uploadImages(listing.id);
        } else {
          this.router.navigate(['/listings', listing.id]);
        }
      },
      error: err => {
        this.error = err.error?.message || 'Eroare la crearea anunțului';
        this.loading = false;
      }
    });
  }

  private uploadImages(listingId: string): void {
    const uploadPromises = this.selectedFiles.map(file =>
      this.listingService.uploadImage(listingId, file).toPromise()
    );

    Promise.allSettled(uploadPromises).then(() => {
      this.router.navigate(['/listings', listingId]);
    });
  }
}

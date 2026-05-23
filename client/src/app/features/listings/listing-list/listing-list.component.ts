import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ListingService } from '../../../_services/listing.service';
import { CategoryService } from '../../../_services/category.service';
import { ListingCard } from '../../../_models/listing.model';
import { Category } from '../../../_models/category.model';
import { PaginatedResult, ListingFilterParams } from '../../../_models/pagination.model';

@Component({
  selector: 'app-listing-list',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './listing-list.component.html'
})
export class ListingListComponent implements OnInit {
  private listingService = inject(ListingService);
  private categoryService = inject(CategoryService);

  result: PaginatedResult<ListingCard> | null = null;
  categories: Category[] = [];
  loading = true;
  error = '';

  // Filter state — bound to the search form
  filters: ListingFilterParams = {
    pageNumber: 1,
    pageSize: 12,
    orderBy: 'date_desc'
  };

  ngOnInit(): void {
    this.loadCategories();
    this.loadListings();
  }

  loadListings(): void {
    this.loading = true;
    this.listingService.getListings(this.filters).subscribe({
      next: result => {
        this.result = result;
        this.loading = false;
      },
      error: () => {
        this.error = 'Nu s-au putut încărca anunțurile';
        this.loading = false;
      }
    });
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe(cats => this.categories = cats);
  }

  onSearch(): void {
    this.filters.pageNumber = 1;
    this.loadListings();
  }

  onPageChange(page: number): void {
    this.filters.pageNumber = page;
    this.loadListings();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  clearFilters(): void {
    this.filters = { pageNumber: 1, pageSize: 12, orderBy: 'date_desc' };
    this.loadListings();
  }

  get pages(): number[] {
    if (!this.result) return [];
    return Array.from({ length: this.result.totalPages }, (_, i) => i + 1);
  }
}

import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FavoritesService } from '../../_services/favorites.service';
import { SvgIconComponent } from '../../shared/svg-icon.component';
import { ListingCard } from '../../_models/listing.model';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterLink, SvgIconComponent],
  templateUrl: './favorites.component.html'
})
export class FavoritesComponent implements OnInit {
  private favoritesService = inject(FavoritesService);

  listings: ListingCard[] = [];
  loading = true;

  ngOnInit(): void {
    this.favoritesService.getFavorites().subscribe({
      next: listings => {
        this.listings = listings;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  removeFavorite(listingId: string): void {
    this.favoritesService.removeFavorite(listingId).subscribe(() => {
      this.listings = this.listings.filter(l => l.id !== listingId);
    });
  }
}

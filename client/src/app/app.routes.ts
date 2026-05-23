import { Routes } from '@angular/router';
import { authGuard } from './_guards/auth.guard';
import { adminGuard } from './_guards/admin.guard';

export const routes: Routes = [
  // Public routes
  {
    path: '',
    loadComponent: () =>
      import('./features/listings/listing-list/listing-list.component')
        .then(m => m.ListingListComponent)
  },
  {
    path: 'listings/:id',
    loadComponent: () =>
      import('./features/listings/listing-detail/listing-detail.component')
        .then(m => m.ListingDetailComponent)
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component')
        .then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/register.component')
        .then(m => m.RegisterComponent)
  },

  // Protected routes (require JWT) — listed BEFORE :id to avoid conflict
  {
    path: 'listings/create',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/listings/listing-create/listing-create.component')
        .then(m => m.ListingCreateComponent)
  },
  {
    path: 'listings/:id/edit',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/listings/listing-edit/listing-edit.component')
        .then(m => m.ListingEditComponent)
  },
  {
    path: 'favorites',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/favorites/favorites.component')
        .then(m => m.FavoritesComponent)
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/profile/profile.component')
        .then(m => m.ProfileComponent)
  },

  // Admin routes
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    loadComponent: () =>
      import('./features/admin/admin.component')
        .then(m => m.AdminComponent)
  },

  // Fallback
  { path: '**', redirectTo: '' }
];

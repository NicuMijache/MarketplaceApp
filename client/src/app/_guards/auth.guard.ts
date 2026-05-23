import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AccountService } from '../_services/account.service';

/**
 * Functional guard (Angular 17 style).
 * Blocks routes that require authentication.
 * If not logged in, redirects to /login.
 *
 * Usage in routes: canActivate: [authGuard]
 */
export const authGuard: CanActivateFn = () => {
  const accountService = inject(AccountService);
  const router = inject(Router);

  if (accountService.isLoggedIn()) return true;

  router.navigate(['/login'], { queryParams: { returnUrl: router.url } });
  return false;
};

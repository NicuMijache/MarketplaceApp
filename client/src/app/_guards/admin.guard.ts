import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AccountService } from '../_services/account.service';

/**
 * Admin-only guard. Checks the role claim from the JWT.
 * If user is logged in but not admin → redirect to home.
 */
export const adminGuard: CanActivateFn = () => {
  const accountService = inject(AccountService);
  const router = inject(Router);

  if (accountService.isAdmin()) return true;

  router.navigate(['/']);
  return false;
};

import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AccountService } from '../_services/account.service';

/**
 * Functional interceptor (Angular 17 style — no class needed).
 * Runs before every HTTP request. If the user is logged in,
 * attaches the JWT as "Authorization: Bearer <token>".
 *
 * The backend reads this header and validates the JWT signature
 * before processing any [Authorize] endpoint.
 */
export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const accountService = inject(AccountService);
  const user = accountService.currentUser();

  if (user?.token) {
    // Clone the request (HttpRequest is immutable) and add the auth header
    const authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${user.token}` }
    });
    return next(authReq);
  }

  return next(req);
};

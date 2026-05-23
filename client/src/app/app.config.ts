import { ApplicationConfig, APP_INITIALIZER } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { jwtInterceptor } from './_interceptors/jwt.interceptor';
import { AccountService } from './_services/account.service';

/**
 * APP_INITIALIZER runs a function before the app renders.
 * We use it to call loadCurrentUser() so the JWT from localStorage
 * is restored into the AccountService signal BEFORE any route guard checks.
 * Without this, AuthGuard would redirect the user to /login on page refresh.
 */
function initializeApp(accountService: AccountService) {
  return () => accountService.loadCurrentUser();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(
      withInterceptors([jwtInterceptor])  // attach JWT to every request
    ),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [AccountService],
      multi: true
    }
  ]
};

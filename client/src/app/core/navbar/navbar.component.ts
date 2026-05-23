import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AccountService } from '../../_services/account.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html'
})
export class NavbarComponent {
  accountService = inject(AccountService);
  menuOpen = false;

  logout(): void {
    this.accountService.logout();
  }
}

import { Component, inject, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AccountService } from '../../_services/account.service';
import { SvgIconComponent } from '../../shared/svg-icon.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, SvgIconComponent],
  templateUrl: './navbar.component.html'
})
export class NavbarComponent {
  accountService = inject(AccountService);
  menuOpen = false;
  profileOpen = false;

  @HostListener('document:click', ['$event'])
  onDocumentClick(e: Event) {
    const target = e.target as HTMLElement;
    if (!target.closest('.relative')) {
      this.profileOpen = false;
    }
  }

  logout(): void {
    this.accountService.logout();
    this.menuOpen = false;
    this.profileOpen = false;
  }
}

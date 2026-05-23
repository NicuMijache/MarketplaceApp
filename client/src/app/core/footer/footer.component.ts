import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="bg-gray-800 text-gray-300 mt-16">
      <div class="max-w-7xl mx-auto px-4 py-10">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 class="text-white font-bold text-lg mb-3">Marketplace</h3>
            <p class="text-sm text-gray-400">Platforma ta de anunțuri online. Cumpără și vinde rapid și sigur.</p>
          </div>
          <div>
            <h4 class="text-white font-semibold mb-3">Link-uri utile</h4>
            <ul class="space-y-1 text-sm">
              <li><a routerLink="/" class="hover:text-white transition-colors">Toate anunțurile</a></li>
              <li><a routerLink="/register" class="hover:text-white transition-colors">Înregistrare</a></li>
              <li><a routerLink="/listings/create" class="hover:text-white transition-colors">Adaugă anunț</a></li>
            </ul>
          </div>
          <div>
            <h4 class="text-white font-semibold mb-3">Contact</h4>
            <p class="text-sm text-gray-400">contact&#64;marketplace.ro</p>
          </div>
        </div>
        <div class="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-500">
          &copy; {{ currentYear }} Marketplace App. Toate drepturile rezervate.
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}

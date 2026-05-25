import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SvgIconComponent } from '../../shared/svg-icon.component';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, SvgIconComponent],
  template: `
    <footer class="border-t border-gray-200 bg-white mt-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
        <div class="flex items-center gap-2">
          <div class="w-5 h-5 bg-green-600 rounded flex items-center justify-center text-white">
            <app-icon name="home" [size]="10" [strokeWidth]="2.5"></app-icon>
          </div>
          <span class="font-semibold text-gray-600">Marketplace</span>
          <span>· © {{ currentYear }}</span>
        </div>
        <div class="flex gap-4">
          <span class="cursor-pointer hover:text-gray-600 transition-colors">Termeni</span>
          <span class="cursor-pointer hover:text-gray-600 transition-colors">Confidențialitate</span>
          <span class="cursor-pointer hover:text-gray-600 transition-colors">Ajutor</span>
          <a routerLink="/register" class="cursor-pointer hover:text-gray-600 transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}

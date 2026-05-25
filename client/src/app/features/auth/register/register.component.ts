import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AccountService } from '../../../_services/account.service';
import { CommonModule } from '@angular/common';
import { SvgIconComponent } from '../../../shared/svg-icon.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink, SvgIconComponent],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private accountService = inject(AccountService);
  private router = inject(Router);

  form: FormGroup = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8),
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)]],
    phoneNumber: [''],
    city: ['']
  });

  loading = false;
  errorMessage = '';
  selectedPhoto: File | null = null;
  photoPreview: string | null = null;

  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.[0]) return;
    this.selectedPhoto = input.files[0];
    const reader = new FileReader();
    reader.onload = e => this.photoPreview = e.target!.result as string;
    reader.readAsDataURL(this.selectedPhoto);
  }

  removePhoto(): void {
    this.selectedPhoto = null;
    this.photoPreview = null;
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.errorMessage = '';

    this.accountService.register(this.form.value).subscribe({
      next: () => {
        // After register, upload photo if selected
        if (this.selectedPhoto) {
          this.accountService.uploadPhoto(this.selectedPhoto).subscribe({
            next: ({ photoUrl }) => {
              this.accountService.updateCurrentUserPhoto(photoUrl);
              this.router.navigate(['/']);
            },
            error: () => this.router.navigate(['/'])  // photo failed but account created
          });
        } else {
          this.router.navigate(['/']);
        }
      },
      error: err => {
        this.errorMessage = Array.isArray(err.error)
          ? err.error.join(', ')
          : (err.error?.message || 'Eroare la înregistrare');
        this.loading = false;
      }
    });
  }
}

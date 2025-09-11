import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="row justify-content-center">
      <div class="col-md-8 col-lg-6">
        <div class="card shadow">
          <div class="card-body">
            <div class="text-center mb-4">
              <h3 class="card-title">Create Account</h3>
              <p class="text-muted">Join us to explore amazing cat breeds!</p>
            </div>

            <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
              <!-- Personal Information -->
              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="firstName" class="form-label">First Name</label>
                    <input 
                      type="text" 
                      id="firstName"
                      class="form-control" 
                      formControlName="firstName"
                      [class.is-invalid]="isFieldInvalid('firstName')"
                      placeholder="Enter your first name"
                      autocomplete="given-name">
                    <div class="invalid-feedback" *ngIf="isFieldInvalid('firstName')">
                      <div *ngIf="registerForm.get('firstName')?.errors?.['required']">First name is required</div>
                      <div *ngIf="registerForm.get('firstName')?.errors?.['minlength']">First name must be at least 2 characters</div>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="lastName" class="form-label">Last Name</label>
                    <input 
                      type="text" 
                      id="lastName"
                      class="form-control" 
                      formControlName="lastName"
                      [class.is-invalid]="isFieldInvalid('lastName')"
                      placeholder="Enter your last name"
                      autocomplete="family-name">
                    <div class="invalid-feedback" *ngIf="isFieldInvalid('lastName')">
                      <div *ngIf="registerForm.get('lastName')?.errors?.['required']">Last name is required</div>
                      <div *ngIf="registerForm.get('lastName')?.errors?.['minlength']">Last name must be at least 2 characters</div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Username Field -->
              <div class="mb-3">
                <label for="username" class="form-label">Username</label>
                <input 
                  type="text" 
                  id="username"
                  class="form-control" 
                  formControlName="username"
                  [class.is-invalid]="isFieldInvalid('username')"
                  placeholder="Choose a unique username"
                  autocomplete="username">
                <div class="invalid-feedback" *ngIf="isFieldInvalid('username')">
                  <div *ngIf="registerForm.get('username')?.errors?.['required']">Username is required</div>
                  <div *ngIf="registerForm.get('username')?.errors?.['minlength']">Username must be at least 3 characters</div>
                  <div *ngIf="registerForm.get('username')?.errors?.['pattern']">Username can only contain letters, numbers, and underscores</div>
                </div>
              </div>

              <!-- Email Field -->
              <div class="mb-3">
                <label for="email" class="form-label">Email Address</label>
                <input 
                  type="email" 
                  id="email"
                  class="form-control" 
                  formControlName="email"
                  [class.is-invalid]="isFieldInvalid('email')"
                  placeholder="Enter your email address"
                  autocomplete="email">
                <div class="invalid-feedback" *ngIf="isFieldInvalid('email')">
                  <div *ngIf="registerForm.get('email')?.errors?.['required']">Email is required</div>
                  <div *ngIf="registerForm.get('email')?.errors?.['email']">Please enter a valid email address</div>
                </div>
              </div>

              <!-- Password Fields -->
              <div class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="password" class="form-label">Password</label>
                    <div class="input-group">
                      <input 
                        [type]="showPassword ? 'text' : 'password'" 
                        id="password"
                        class="form-control" 
                        formControlName="password"
                        [class.is-invalid]="isFieldInvalid('password')"
                        placeholder="Create a password"
                        autocomplete="new-password">
                      <button 
                        type="button" 
                        class="btn btn-outline-secondary" 
                        (click)="togglePasswordVisibility()">
                        <i [class]="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                      </button>
                    </div>
                    <div class="invalid-feedback" *ngIf="isFieldInvalid('password')">
                      <div *ngIf="registerForm.get('password')?.errors?.['required']">Password is required</div>
                      <div *ngIf="registerForm.get('password')?.errors?.['minlength']">Password must be at least 6 characters</div>
                      <div *ngIf="registerForm.get('password')?.errors?.['pattern']">Password must contain at least one letter and one number</div>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label for="confirmPassword" class="form-label">Confirm Password</label>
                    <div class="input-group">
                      <input 
                        [type]="showConfirmPassword ? 'text' : 'password'" 
                        id="confirmPassword"
                        class="form-control" 
                        formControlName="confirmPassword"
                        [class.is-invalid]="isFieldInvalid('confirmPassword') || hasPasswordMismatch()"
                        placeholder="Confirm your password"
                        autocomplete="new-password">
                      <button 
                        type="button" 
                        class="btn btn-outline-secondary" 
                        (click)="toggleConfirmPasswordVisibility()">
                        <i [class]="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                      </button>
                    </div>
                    <div class="invalid-feedback" *ngIf="isFieldInvalid('confirmPassword') || hasPasswordMismatch()">
                      <div *ngIf="registerForm.get('confirmPassword')?.errors?.['required']">Please confirm your password</div>
                      <div *ngIf="hasPasswordMismatch()">Passwords do not match</div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Password Strength Indicator -->
              <div class="mb-3" *ngIf="registerForm.get('password')?.value">
                <label class="form-label">Password Strength:</label>
                <div class="progress" style="height: 5px;">
                  <div 
                    class="progress-bar" 
                    [class]="getPasswordStrengthClass()"
                    [style.width.%]="getPasswordStrength()"
                    role="progressbar">
                  </div>
                </div>
                <small class="form-text" [class]="getPasswordStrengthTextClass()">
                  {{getPasswordStrengthText()}}
                </small>
              </div>

              <!-- Terms and Conditions -->
              <div class="mb-3">
                <div class="form-check">
                  <input 
                    class="form-check-input" 
                    type="checkbox" 
                    id="agreeToTerms"
                    formControlName="agreeToTerms"
                    [class.is-invalid]="isFieldInvalid('agreeToTerms')">
                  <label class="form-check-label" for="agreeToTerms">
                    I agree to the <a href="#" class="text-decoration-none">Terms of Service</a> and 
                    <a href="#" class="text-decoration-none">Privacy Policy</a>
                  </label>
                  <div class="invalid-feedback" *ngIf="isFieldInvalid('agreeToTerms')">
                    You must agree to the terms and conditions
                  </div>
                </div>
              </div>

              <!-- Error Alert -->
              <div class="alert alert-danger" *ngIf="errorMessage">
                <i class="fas fa-exclamation-triangle me-2"></i>
                {{errorMessage}}
              </div>

              <!-- Success Alert -->
              <div class="alert alert-success" *ngIf="successMessage">
                <i class="fas fa-check-circle me-2"></i>
                {{successMessage}}
              </div>

              <!-- Submit Button -->
              <div class="d-grid gap-2 mb-3">
                <button 
                  type="submit" 
                  class="btn btn-primary"
                  [disabled]="registerForm.invalid || loading">
                  <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
                  <i *ngIf="!loading" class="fas fa-user-plus me-2"></i>
                  {{loading ? 'Creating Account...' : 'Create Account'}}
                </button>
              </div>

              <!-- Login Link -->
              <div class="text-center">
                <p class="mb-0">
                  Already have an account? 
                  <a routerLink="/login" class="text-decoration-none">Sign in here</a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      border: none;
      border-radius: 1rem;
    }
    .card-body {
      padding: 2rem;
    }
    .btn {
      border-radius: 0.5rem;
    }
    .form-control {
      border-radius: 0.5rem;
      padding: 0.75rem;
    }
    .input-group .btn {
      border-radius: 0 0.5rem 0.5rem 0;
    }
    .alert {
      border-radius: 0.5rem;
    }
    .shadow {
      box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
    }
    .form-check-input:focus {
      border-color: #007bff;
      box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
    }
    .text-weak { color: #dc3545; }
    .text-fair { color: #ffc107; }
    .text-good { color: #28a745; }
    .text-strong { color: #17a2b8; }
  `]
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  errorMessage = '';
  successMessage = '';
  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      username: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z0-9_]+$/)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)/)]],
      confirmPassword: ['', [Validators.required]],
      agreeToTerms: [false, [Validators.requiredTrue]]
    });
  }

  ngOnInit(): void {
    // Redirect if already authenticated
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/profile']);
    }
  }

  onSubmit(): void {
    if (this.registerForm.valid && !this.hasPasswordMismatch()) {
      this.loading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const { confirmPassword, agreeToTerms, ...registrationData } = this.registerForm.value;
      
      this.authService.register(registrationData).subscribe({
        next: (response) => {
          this.successMessage = 'Account created successfully! Redirecting to your profile...';
          setTimeout(() => {
            this.router.navigate(['/profile']);
          }, 2000);
        },
        error: (error) => {
          this.loading = false;
          if (error.status === 409) {
            this.errorMessage = 'Username or email already exists. Please try different ones.';
          } else if (error.status === 400) {
            this.errorMessage = 'Please check your input and try again.';
          } else {
            this.errorMessage = 'An error occurred while creating your account. Please try again later.';
          }
          console.error('Registration error:', error);
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  hasPasswordMismatch(): boolean {
    const password = this.registerForm.get('password')?.value;
    const confirmPassword = this.registerForm.get('confirmPassword')?.value;
    const confirmPasswordField = this.registerForm.get('confirmPassword');
    
    return !!(confirmPasswordField && confirmPasswordField.touched && 
             password && confirmPassword && password !== confirmPassword);
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  getPasswordStrength(): number {
    const password = this.registerForm.get('password')?.value || '';
    let strength = 0;
    
    if (password.length >= 6) strength += 20;
    if (password.length >= 8) strength += 20;
    if (/[A-Z]/.test(password)) strength += 20;
    if (/[a-z]/.test(password)) strength += 20;
    if (/\d/.test(password)) strength += 20;
    if (/[^A-Za-z0-9]/.test(password)) strength += 20;
    
    return Math.min(strength, 100);
  }

  getPasswordStrengthClass(): string {
    const strength = this.getPasswordStrength();
    if (strength <= 40) return 'bg-danger';
    if (strength <= 60) return 'bg-warning';
    if (strength <= 80) return 'bg-info';
    return 'bg-success';
  }

  getPasswordStrengthText(): string {
    const strength = this.getPasswordStrength();
    if (strength <= 40) return 'Weak';
    if (strength <= 60) return 'Fair';
    if (strength <= 80) return 'Good';
    return 'Strong';
  }

  getPasswordStrengthTextClass(): string {
    const strength = this.getPasswordStrength();
    if (strength <= 40) return 'text-weak';
    if (strength <= 60) return 'text-fair';
    if (strength <= 80) return 'text-good';
    return 'text-strong';
  }

  private markFormGroupTouched(): void {
    Object.keys(this.registerForm.controls).forEach(key => {
      const control = this.registerForm.get(key);
      control?.markAsTouched();
    });
  }
}
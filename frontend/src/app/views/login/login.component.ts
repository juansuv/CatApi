import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="row justify-content-center align-items-center min-vh-100">
      <div class="col-md-6 col-lg-5 col-xl-4">
        <div class="card login-card fade-in">
          <div class="card-body">
            <div class="text-center mb-4">
              <div class="login-icon mb-3">
                <i class="fas fa-cat"></i>
              </div>
              <h2 class="card-title mb-2">Welcome Back</h2>
              <p class="text-muted">Sign in to explore amazing cat breeds</p>
            </div>

            <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
              <!-- Username Field -->
              <div class="mb-3">
                <label for="username" class="form-label">Username</label>
                <input 
                  type="text" 
                  id="username"
                  class="form-control" 
                  formControlName="username"
                  [class.is-invalid]="isFieldInvalid('username')"
                  placeholder="Enter your username"
                  autocomplete="username">
                <div class="invalid-feedback" *ngIf="isFieldInvalid('username')">
                  <div *ngIf="loginForm.get('username')?.errors?.['required']">Username is required</div>
                  <div *ngIf="loginForm.get('username')?.errors?.['minlength']">Username must be at least 3 characters</div>
                </div>
              </div>

              <!-- Password Field -->
              <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <div class="input-group">
                  <input 
                    [type]="showPassword ? 'text' : 'password'" 
                    id="password"
                    class="form-control" 
                    formControlName="password"
                    [class.is-invalid]="isFieldInvalid('password')"
                    placeholder="Enter your password"
                    autocomplete="current-password">
                  <button 
                    type="button" 
                    class="btn btn-outline-secondary" 
                    (click)="togglePasswordVisibility()">
                    <i [class]="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                  </button>
                </div>
                <div class="invalid-feedback" *ngIf="isFieldInvalid('password')">
                  <div *ngIf="loginForm.get('password')?.errors?.['required']">Password is required</div>
                  <div *ngIf="loginForm.get('password')?.errors?.['minlength']">Password must be at least 6 characters</div>
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
                  [disabled]="loginForm.invalid || loading">
                  <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
                  <i *ngIf="!loading" class="fas fa-sign-in-alt me-2"></i>
                  {{loading ? 'Signing In...' : 'Sign In'}}
                </button>
              </div>

              <!-- Register Link -->
              <div class="text-center">
                <p class="mb-0">
                  Don't have an account? 
                  <a routerLink="/register" class="text-decoration-none">Sign up here</a>
                </p>
              </div>
            </form>
          </div>
        </div>

        <!-- Demo Credentials Card -->
        <div class="card demo-card mt-4 glass">
          <div class="card-body text-center">
            <h6 class="mb-3">
              <i class="fas fa-rocket me-2"></i>
              Quick Demo
            </h6>
            <p class="small text-muted mb-3">Try the app with demo credentials</p>
            <button 
              type="button" 
              class="btn btn-outline-primary btn-sm" 
              (click)="fillDemoCredentials()">
              <i class="fas fa-play me-2"></i>
              Use Demo Account
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .min-vh-100 {
      min-height: calc(100vh - 80px);
    }
    
    .login-card {
      border: none;
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-xl);
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
    }
    
    .login-icon {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto;
      font-size: 1.5rem;
    }
    
    .demo-card {
      border: 1px solid rgba(255, 255, 255, 0.3);
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
    }
    
    .card-body {
      padding: 2.5rem;
    }
    
    .form-control {
      padding: 0.9rem 1rem;
      border: 2px solid var(--gray-200);
      border-radius: var(--radius-md);
      font-size: 0.95rem;
      transition: all 0.3s ease;
    }
    
    .form-control:focus {
      border-color: var(--primary-400);
      box-shadow: 0 0 0 4px rgba(26, 133, 255, 0.1);
    }
    
    .input-group .btn {
      border-radius: 0 var(--radius-md) var(--radius-md) 0;
      border: 2px solid var(--gray-200);
      border-left: none;
    }
    
    .btn {
      padding: 0.9rem 1.5rem;
      font-weight: 600;
      letter-spacing: 0.025em;
    }
    
    h2 {
      color: var(--gray-800);
      font-weight: 700;
      letter-spacing: -0.025em;
    }
  `]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  errorMessage = '';
  successMessage = '';
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    // Redirect if already authenticated
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/profile']);
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const loginData = this.loginForm.value;
      
      this.authService.login(loginData).subscribe({
        next: (response) => {
          this.successMessage = 'Login successful! Redirecting...';
          setTimeout(() => {
            this.router.navigate(['/profile']);
          }, 1500);
        },
        error: (error) => {
          this.loading = false;
          if (error.status === 401) {
            this.errorMessage = 'Invalid username or password. Please try again.';
          } else if (error.status === 400) {
            this.errorMessage = 'Please check your input and try again.';
          } else {
            this.errorMessage = 'An error occurred. Please try again later.';
          }
          console.error('Login error:', error);
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  fillDemoCredentials(): void {
    this.loginForm.patchValue({
      username: 'demo',
      password: 'demo123'
    });
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }
}
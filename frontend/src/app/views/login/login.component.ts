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
    <div class="login-container">
      <div class="login-grid">
        <!-- Left Side - Branding -->
        <div class="branding-section">
          <div class="brand-content">
            <div class="brand-logo">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"></path>
                <path d="M9 13a4.5 4.5 0 0 0 3-4"></path>
                <path d="M6.003 5.125A3 3 0 0 0 6.003 6.5"></path>
                <path d="M3.477 10.896a4 4 0 0 1 .585-.396"></path>
                <path d="M6 18a4 4 0 0 1-1.967-.516"></path>
                <path d="M12 13h4"></path>
                <path d="M12 18h6a2 2 0 0 1 2 2v1"></path>
                <path d="M12 8v5"></path>
                <path d="M16 8.5a2 2 0 0 1 2-2"></path>
              </svg>
            </div>
            <h1 class="brand-title">Cat Explorer</h1>
            <p class="brand-subtitle">Discover the fascinating world of cat breeds with our premium platform</p>
            
            <div class="features-list">
              <div class="feature-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22,4 12,14.01 9,11.01"></polyline>
                </svg>
                <span>Explore 200+ cat breeds</span>
              </div>
              <div class="feature-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="M21 21l-4.35-4.35"></path>
                </svg>
                <span>Advanced search filters</span>
              </div>
              <div class="feature-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span>Personalized profile</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Side - Login Form -->
        <div class="form-section">
          <div class="form-container">
            <div class="form-header">
              <h2 class="form-title">Welcome back</h2>
              <p class="form-subtitle">Please sign in to your account</p>
            </div>

            <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
              <!-- Username Field -->
              <div class="input-group">
                <label for="username" class="input-label">Username</label>
                <div class="input-wrapper">
                  <svg class="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  <input 
                    type="text" 
                    id="username"
                    class="modern-input" 
                    formControlName="username"
                    [class.error]="isFieldInvalid('username')"
                    placeholder="Enter your username"
                    autocomplete="username">
                </div>
                <div class="error-message" *ngIf="isFieldInvalid('username')">
                  <span *ngIf="loginForm.get('username')?.errors?.['required']">Username is required</span>
                  <span *ngIf="loginForm.get('username')?.errors?.['minlength']">Username must be at least 3 characters</span>
                </div>
              </div>

              <!-- Password Field -->
              <div class="input-group">
                <label for="password" class="input-label">Password</label>
                <div class="input-wrapper">
                  <svg class="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <circle cx="12" cy="16" r="1"></circle>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                  <input 
                    [type]="showPassword ? 'text' : 'password'" 
                    id="password"
                    class="modern-input" 
                    formControlName="password"
                    [class.error]="isFieldInvalid('password')"
                    placeholder="Enter your password"
                    autocomplete="current-password">
                  <button 
                    type="button" 
                    class="toggle-password" 
                    (click)="togglePasswordVisibility()">
                    <svg *ngIf="!showPassword" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    <svg *ngIf="showPassword" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  </button>
                </div>
                <div class="error-message" *ngIf="isFieldInvalid('password')">
                  <span *ngIf="loginForm.get('password')?.errors?.['required']">Password is required</span>
                  <span *ngIf="loginForm.get('password')?.errors?.['minlength']">Password must be at least 6 characters</span>
                </div>
              </div>

              <!-- Error Alert -->
              <div class="alert error" *ngIf="errorMessage">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <span>{{errorMessage}}</span>
              </div>

              <!-- Success Alert -->
              <div class="alert success" *ngIf="successMessage">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22,4 12,14.01 9,11.01"></polyline>
                </svg>
                <span>{{successMessage}}</span>
              </div>

              <!-- Submit Button -->
              <button 
                type="submit" 
                class="submit-btn"
                [disabled]="loginForm.invalid || loading"
                [class.loading]="loading">
                <div class="btn-content">
                  <div *ngIf="loading" class="loading-spinner"></div>
                  <svg *ngIf="!loading" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M15 3h6v6"></path>
                    <path d="M10 14l11-11"></path>
                    <path d="M15 21v-8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8"></path>
                  </svg>
                  <span>{{loading ? 'Signing In...' : 'Sign In'}}</span>
                </div>
              </button>
            </form>

            <!-- Footer Links -->
            <div class="form-footer">
              <p class="signup-text">
                Don't have an account? 
                <a routerLink="/register" class="signup-link">Create one now</a>
              </p>
              
              <div class="demo-section">
                <div class="demo-divider">
                  <span>or</span>
                </div>
                <button 
                  type="button" 
                  class="demo-btn" 
                  (click)="fillDemoCredentials()">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="5,3 19,12 5,21 5,3"></polygon>
                  </svg>
                  <span>Try Demo Account</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      --brand-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      --success-color: #10b981;
      --error-color: #ef4444;
      --warning-color: #f59e0b;
    }

    .login-container {
      min-height: 100vh;
      background: var(--bg-secondary);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    }

    .login-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      min-height: 100vh;
    }

    /* Branding Section */
    .branding-section {
      background: var(--brand-gradient);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 3rem;
      color: white;
      position: relative;
      overflow: hidden;
    }

    .branding-section::before {
      content: '';
      position: absolute;
      top: -50%;
      right: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
      animation: float 20s ease-in-out infinite;
    }

    @keyframes float {
      0%, 100% { transform: translate(0, 0) rotate(0deg); }
      33% { transform: translate(30px, -30px) rotate(120deg); }
      66% { transform: translate(-20px, 20px) rotate(240deg); }
    }

    .brand-content {
      max-width: 480px;
      position: relative;
      z-index: 1;
    }

    .brand-logo {
      width: 80px;
      height: 80px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: var(--radius-xl);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 2rem;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.3);
    }

    .brand-title {
      font-size: 3rem;
      font-weight: 800;
      margin-bottom: 1rem;
      letter-spacing: -0.02em;
      background: linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.8) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .brand-subtitle {
      font-size: 1.25rem;
      opacity: 0.9;
      line-height: 1.6;
      margin-bottom: 3rem;
    }

    .features-list {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .feature-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      font-size: 1.125rem;
      opacity: 0.9;
    }

    .feature-item svg {
      flex-shrink: 0;
      padding: 0.5rem;
      background: rgba(255, 255, 255, 0.2);
      border-radius: var(--radius-sm);
    }

    /* Form Section */
    .form-section {
      background: white;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 3rem;
    }

    .form-container {
      width: 100%;
      max-width: 400px;
    }

    .form-header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .form-title {
      font-size: 2.25rem;
      font-weight: 800;
      color: var(--text-primary);
      margin-bottom: 0.5rem;
      letter-spacing: -0.02em;
    }

    .form-subtitle {
      font-size: 1rem;
      color: var(--text-muted);
      margin: 0;
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .input-group {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .input-label {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--text-primary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin: 0;
    }

    .input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }

    .input-icon {
      position: absolute;
      left: 1rem;
      color: var(--text-muted);
      z-index: 1;
    }

    .modern-input {
      width: 100%;
      padding: 1rem 1rem 1rem 3rem;
      border: 2px solid var(--border-color);
      border-radius: var(--radius-md);
      font-size: 1rem;
      background: white;
      color: var(--text-primary);
      transition: all 0.2s ease;
      font-family: inherit;
    }

    .modern-input:focus {
      outline: none;
      border-color: var(--primary-500);
      box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
    }

    .modern-input.error {
      border-color: var(--error-color);
    }

    .modern-input.error:focus {
      box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.1);
    }

    .toggle-password {
      position: absolute;
      right: 1rem;
      background: none;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      padding: 0.25rem;
      border-radius: var(--radius-sm);
      transition: all 0.2s ease;
      z-index: 1;
    }

    .toggle-password:hover {
      color: var(--primary-500);
      background: var(--primary-50);
    }

    .error-message {
      color: var(--error-color);
      font-size: 0.875rem;
      font-weight: 500;
    }

    .alert {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem 1.25rem;
      border-radius: var(--radius-md);
      font-size: 0.875rem;
      font-weight: 500;
      margin: 0.5rem 0;
    }

    .alert.error {
      background: #fef2f2;
      color: var(--error-color);
      border: 1px solid rgba(239, 68, 68, 0.2);
    }

    .alert.success {
      background: #f0fdf4;
      color: var(--success-color);
      border: 1px solid rgba(16, 185, 129, 0.2);
    }

    .submit-btn {
      width: 100%;
      padding: 1.25rem 2rem;
      background: var(--brand-gradient);
      color: white;
      border: none;
      border-radius: var(--radius-md);
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      position: relative;
      overflow: hidden;
      box-shadow: var(--shadow-md);
    }

    .submit-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
      filter: brightness(1.05);
    }

    .submit-btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
      transform: none;
    }

    .submit-btn.loading {
      color: transparent;
    }

    .btn-content {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
    }

    .loading-spinner {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 20px;
      height: 20px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top: 2px solid white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: translate(-50%, -50%) rotate(0deg); }
      100% { transform: translate(-50%, -50%) rotate(360deg); }
    }

    .form-footer {
      margin-top: 2.5rem;
      text-align: center;
    }

    .signup-text {
      color: var(--text-muted);
      font-size: 0.875rem;
      margin-bottom: 2rem;
    }

    .signup-link {
      color: var(--primary-500);
      text-decoration: none;
      font-weight: 600;
      transition: all 0.2s ease;
    }

    .signup-link:hover {
      color: var(--primary-600);
      text-decoration: underline;
    }

    .demo-section {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .demo-divider {
      position: relative;
      text-align: center;
      color: var(--text-muted);
      font-size: 0.875rem;
    }

    .demo-divider::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      height: 1px;
      background: var(--border-color);
      z-index: 0;
    }

    .demo-divider span {
      background: white;
      padding: 0 1rem;
      position: relative;
      z-index: 1;
    }

    .demo-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      padding: 0.875rem 1.5rem;
      background: transparent;
      border: 2px solid var(--border-color);
      border-radius: var(--radius-md);
      color: var(--text-secondary);
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .demo-btn:hover {
      border-color: var(--primary-500);
      background: var(--primary-50);
      color: var(--primary-500);
      transform: translateY(-1px);
      box-shadow: var(--shadow-sm);
    }

    /* Responsive Design */
    @media (max-width: 1024px) {
      .login-grid {
        grid-template-columns: 1fr;
      }

      .branding-section {
        display: none;
      }

      .form-section {
        padding: 2rem 1rem;
      }
    }

    @media (max-width: 640px) {
      .form-container {
        max-width: none;
      }

      .form-title {
        font-size: 2rem;
      }

      .brand-title {
        font-size: 2.5rem;
      }

      .features-list {
        gap: 1rem;
      }

      .feature-item {
        font-size: 1rem;
      }
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
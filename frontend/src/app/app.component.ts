import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { User } from './models/user.models';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  template: `
    <nav class="modern-navbar">
      <div class="navbar-container">
        <div class="navbar-brand" routerLink="/">
          <div class="brand-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
          <span class="brand-text">Cat Explorer</span>
        </div>

        <div class="navbar-menu" [class.active]="menuOpen">
          <div class="nav-section">
            <a class="nav-item" routerLink="/breeds" routerLinkActive="active">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="4" r="2"></circle>
                <circle cx="18" cy="8" r="2"></circle>
                <circle cx="20" cy="16" r="2"></circle>
                <path d="M9 10a5 5 0 0 1 5.5 0M8.8 21.3c-1 0-1.8-.8-1.8-1.8s.8-1.8 1.8-1.8 1.8.8 1.8 1.8-.8 1.8-1.8 1.8Z"></path>
              </svg>
              <span>Breeds</span>
            </a>
            <a class="nav-item" routerLink="/search" routerLinkActive="active">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="M21 21l-4.35-4.35"></path>
              </svg>
              <span>Search</span>
            </a>
          </div>

          <div class="nav-section auth-section">
            <ng-container *ngIf="!currentUser">
              <a class="nav-item" routerLink="/login" routerLinkActive="active">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M15 3h6v6"></path>
                  <path d="M10 14l11-11"></path>
                  <path d="M15 21v-8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8"></path>
                </svg>
                <span>Login</span>
              </a>
              <a class="nav-item register-btn" routerLink="/register" routerLinkActive="active">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <line x1="19" y1="8" x2="19" y2="14"></line>
                  <line x1="22" y1="11" x2="16" y2="11"></line>
                </svg>
                <span>Register</span>
              </a>
            </ng-container>

            <ng-container *ngIf="currentUser">
              <div class="user-menu" [class.open]="userMenuOpen">
                <button class="user-trigger" (click)="toggleUserMenu()">
                  <div class="user-avatar">
                    {{getInitials()}}
                  </div>
                  <span class="user-name">{{currentUser.firstName}}</span>
                  <svg class="chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M6 9l6 6 6-6"></path>
                  </svg>
                </button>
                
                <div class="user-dropdown" *ngIf="userMenuOpen">
                  <a class="dropdown-item" routerLink="/profile" (click)="closeUserMenu()">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    <span>My Profile</span>
                  </a>
                  <div class="dropdown-divider"></div>
                  <button class="dropdown-item danger" (click)="logout()">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                      <polyline points="16,17 21,12 16,7"></polyline>
                      <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </ng-container>
          </div>
        </div>

        <button class="mobile-toggle" (click)="toggleMenu()" [class.open]="menuOpen">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>

    <main class="main-content">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    :host {
      --nav-height: 80px;
    }

    .modern-navbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: var(--nav-height);
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border-bottom: 1px solid var(--border-color);
      z-index: 1000;
      box-shadow: var(--shadow-sm);
    }

    .navbar-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 2rem;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .navbar-brand {
      display: flex;
      align-items: center;
      gap: 1rem;
      cursor: pointer;
      text-decoration: none;
      color: var(--text-primary);
      font-weight: 700;
      font-size: 1.5rem;
      transition: all 0.2s ease;
    }

    .navbar-brand:hover {
      color: var(--primary-500);
      transform: translateY(-1px);
    }

    .brand-icon {
      padding: 0.5rem;
      background: var(--primary-gradient);
      border-radius: var(--radius-md);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: var(--shadow-sm);
    }

    .brand-text {
      background: var(--primary-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      letter-spacing: -0.02em;
    }

    .navbar-menu {
      display: flex;
      align-items: center;
      gap: 2rem;
    }

    .nav-section {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .auth-section {
      margin-left: 2rem;
      padding-left: 2rem;
      border-left: 1px solid var(--border-color);
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1.25rem;
      border-radius: var(--radius-md);
      color: var(--text-secondary);
      text-decoration: none;
      font-weight: 500;
      transition: all 0.2s ease;
      position: relative;
    }

    .nav-item:hover {
      color: var(--primary-500);
      background: var(--primary-50);
      transform: translateY(-1px);
    }

    .nav-item.active {
      color: var(--primary-500);
      background: var(--primary-50);
      box-shadow: var(--shadow-sm);
    }

    .nav-item.active::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 4px;
      height: 4px;
      background: var(--primary-gradient);
      border-radius: 50%;
    }

    .register-btn {
      background: var(--primary-gradient) !important;
      color: white !important;
      box-shadow: var(--shadow-sm);
    }

    .register-btn:hover {
      background: var(--primary-gradient) !important;
      color: white !important;
      box-shadow: var(--shadow-md);
      filter: brightness(1.1);
    }

    .user-menu {
      position: relative;
    }

    .user-trigger {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.5rem 1rem;
      background: transparent;
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: all 0.2s ease;
      color: var(--text-secondary);
      font-weight: 500;
    }

    .user-trigger:hover {
      border-color: var(--primary-500);
      background: var(--primary-50);
      color: var(--primary-500);
      transform: translateY(-1px);
      box-shadow: var(--shadow-sm);
    }

    .user-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: var(--primary-gradient);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 0.875rem;
      box-shadow: var(--shadow-sm);
    }

    .user-name {
      font-weight: 600;
      color: inherit;
    }

    .chevron {
      transition: transform 0.2s ease;
    }

    .user-menu.open .chevron {
      transform: rotate(180deg);
    }

    .user-dropdown {
      position: absolute;
      top: calc(100% + 0.5rem);
      right: 0;
      min-width: 200px;
      background: white;
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-xl);
      border: 1px solid var(--border-color);
      overflow: hidden;
      z-index: 1000;
      animation: dropdownFadeIn 0.2s ease;
    }

    @keyframes dropdownFadeIn {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .dropdown-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem 1.25rem;
      color: var(--text-secondary);
      text-decoration: none;
      background: none;
      border: none;
      width: 100%;
      text-align: left;
      font-weight: 500;
      transition: all 0.2s ease;
      cursor: pointer;
    }

    .dropdown-item:hover {
      background: var(--primary-50);
      color: var(--primary-500);
    }

    .dropdown-item.danger {
      color: #e53e3e;
    }

    .dropdown-item.danger:hover {
      background: #fef2f2;
      color: #c53030;
    }

    .dropdown-divider {
      height: 1px;
      background: var(--border-color);
      margin: 0.5rem 0;
    }

    .mobile-toggle {
      display: none;
      flex-direction: column;
      gap: 0.25rem;
      padding: 0.5rem;
      background: transparent;
      border: 1px solid var(--border-color);
      border-radius: var(--radius-sm);
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .mobile-toggle:hover {
      border-color: var(--primary-500);
      background: var(--primary-50);
    }

    .mobile-toggle span {
      width: 20px;
      height: 2px;
      background: var(--text-secondary);
      border-radius: 1px;
      transition: all 0.3s ease;
    }

    .mobile-toggle.open span:nth-child(1) {
      transform: rotate(45deg) translate(6px, 6px);
    }

    .mobile-toggle.open span:nth-child(2) {
      opacity: 0;
    }

    .mobile-toggle.open span:nth-child(3) {
      transform: rotate(-45deg) translate(6px, -6px);
    }

    .main-content {
      padding-top: var(--nav-height);
      min-height: 100vh;
    }

    /* Mobile Responsive */
    @media (max-width: 768px) {
      .navbar-container {
        padding: 0 1rem;
      }

      .mobile-toggle {
        display: flex;
      }

      .navbar-menu {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: rgba(255, 255, 255, 0.98);
        backdrop-filter: blur(20px);
        border-top: 1px solid var(--border-color);
        padding: 2rem;
        flex-direction: column;
        gap: 1rem;
        opacity: 0;
        visibility: hidden;
        transform: translateY(-20px);
        transition: all 0.3s ease;
      }

      .navbar-menu.active {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
      }

      .nav-section {
        flex-direction: column;
        width: 100%;
        gap: 0.5rem;
      }

      .auth-section {
        margin-left: 0;
        padding-left: 0;
        border-left: none;
        border-top: 1px solid var(--border-color);
        padding-top: 1rem;
      }

      .nav-item {
        width: 100%;
        justify-content: flex-start;
        padding: 1rem;
      }

      .user-dropdown {
        position: static;
        box-shadow: none;
        border: 1px solid var(--border-color);
        border-radius: var(--radius-md);
        margin-top: 0.5rem;
      }
    }
  `]
})
export class AppComponent implements OnInit {
  title = 'cat-api-frontend';
  currentUser: User | null = null;
  menuOpen = false;
  userMenuOpen = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  toggleUserMenu(): void {
    this.userMenuOpen = !this.userMenuOpen;
  }

  closeUserMenu(): void {
    this.userMenuOpen = false;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
    this.closeUserMenu();
  }

  getInitials(): string {
    if (!this.currentUser) return '';
    return `${this.currentUser.firstName.charAt(0)}${this.currentUser.lastName.charAt(0)}`.toUpperCase();
  }
}



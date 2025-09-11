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
    <nav class="navbar navbar-expand-lg fixed-top">
      <div class="container">
        <a class="navbar-brand d-flex align-items-center" routerLink="/">
          <i class="fas fa-cat me-2"></i>
          <span>Cat Explorer</span>
        </a>
        <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <a class="nav-link d-flex align-items-center" routerLink="/breeds" routerLinkActive="active">
                <i class="fas fa-paw me-2"></i>
                Breeds
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link d-flex align-items-center" routerLink="/search" routerLinkActive="active">
                <i class="fas fa-search me-2"></i>
                Search
              </a>
            </li>
          </ul>
          <ul class="navbar-nav">
            <ng-container *ngIf="!currentUser">
              <li class="nav-item">
                <a class="nav-link d-flex align-items-center" routerLink="/login" routerLinkActive="active">
                  <i class="fas fa-sign-in-alt me-2"></i>
                  Login
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link d-flex align-items-center" routerLink="/register" routerLinkActive="active">
                  <i class="fas fa-user-plus me-2"></i>
                  Register
                </a>
              </li>
            </ng-container>
            <ng-container *ngIf="currentUser">
              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle d-flex align-items-center"
                   id="userDropdown"
                   data-bs-toggle="dropdown"
                   aria-expanded="false"
                   style="cursor: pointer;">
                  <div class="user-avatar me-2">
                    {{getInitials()}}
                  </div>
                  <span class="d-none d-md-inline">{{currentUser.firstName}}</span>
                </a>
                <ul class="dropdown-menu dropdown-menu-end shadow">
                  <li>
                    <a class="dropdown-item d-flex align-items-center" routerLink="/profile">
                      <i class="fas fa-user me-2"></i>
                      My Profile
                    </a>
                  </li>
                  <li><hr class="dropdown-divider"></li>
                  <li>
                    <button class="dropdown-item d-flex align-items-center text-danger" (click)="logout()">
                      <i class="fas fa-sign-out-alt me-2"></i>
                      Logout
                    </button>
                  </li>
                </ul>
              </li>
            </ng-container>
          </ul>
        </div>
      </div>
    </nav>

    <main class="main-content">
      <div class="container">
        <router-outlet></router-outlet>
      </div>
    </main>
  `,
  styles: [`
    .main-content {
      padding-top: 80px;
      min-height: 100vh;
    }

    .user-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 0.8rem;
    }

    .dropdown-menu {
      border: none;
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-xl);
      padding: 0.5rem;
    }

    .dropdown-item {
      border-radius: var(--radius-md);
      padding: 0.75rem 1rem;
      font-weight: 500;
      transition: all 0.2s ease;
    }

    .dropdown-item:hover {
      background-color: var(--primary-50);
      color: var(--primary-600);
    }

    .dropdown-item.text-danger:hover {
      background-color: var(--danger-50);
      color: var(--danger-600);
    }

    .navbar-toggler:focus {
      box-shadow: none;
    }
  `]
})
export class AppComponent implements OnInit {
  title = 'cat-api-frontend';
  currentUser: User | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  getInitials(): string {
    if (!this.currentUser) return '';
    return `${this.currentUser.firstName.charAt(0)}${this.currentUser.lastName.charAt(0)}`.toUpperCase();
  }
}



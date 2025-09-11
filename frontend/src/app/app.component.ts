import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule, Router } from '@angular/router';

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

    .navbar-toggler:focus {
      box-shadow: none;
    }
  `]
})
export class AppComponent {
  title = 'cat-api-frontend';

  constructor(
    private router: Router
  ) {}

}

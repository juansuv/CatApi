import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.models';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="row">
      <div class="col-12">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h1 class="mb-0">My Profile</h1>
          <button
            class="btn btn-outline-primary"
            (click)="refreshProfile()"
            [disabled]="loading">
            <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
            <i *ngIf="!loading" class="fas fa-sync-alt me-2"></i>
            Refresh
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div class="row" *ngIf="loading && !user">
      <div class="col-12 text-center">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-2 text-muted">Loading your profile...</p>
      </div>
    </div>

    <!-- Error State -->
    <div class="row" *ngIf="errorMessage">
      <div class="col-12">
        <div class="alert alert-danger">
          <i class="fas fa-exclamation-triangle me-2"></i>
          {{errorMessage}}
        </div>
      </div>
    </div>

    <!-- Profile Content -->
    <div class="row" *ngIf="user">
      <!-- User Info Card -->
      <div class="col-lg-4">
        <div class="card mb-4">
          <div class="card-body text-center">
            <div class="mb-3">
              <div class="bg-primary text-white rounded-circle mx-auto d-flex align-items-center justify-content-center"
                   style="width: 80px; height: 80px; font-size: 2rem;">
                {{getInitials()}}
              </div>
            </div>
            <h4 class="card-title">{{user.firstName}} {{user.lastName}}</h4>
            <p class="text-muted mb-1">&#64;{{user.username}}</p>
            <p class="text-muted">{{user.email}}</p>

            <div class="row mt-3">
              <div class="col-6">
                <div class="bg-light p-3 rounded">
                  <h6 class="mb-0">Member Since</h6>
                  <small class="text-muted">{{formatDate(user.createdAt)}}</small>
                </div>
              </div>
              <div class="col-6">
                <div class="bg-light p-3 rounded">
                  <h6 class="mb-0">Last Updated</h6>
                  <small class="text-muted">{{formatDate(user.updatedAt)}}</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Stats Card -->
        <div class="card">
          <div class="card-header">
            <h5 class="mb-0">
              <i class="fas fa-chart-bar me-2"></i>
              Quick Stats
            </h5>
          </div>
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <span>Account Status</span>
              <span class="badge bg-success">Active</span>
            </div>
            <div class="d-flex justify-content-between align-items-center mb-2">
              <span>Profile Completion</span>
              <span class="badge bg-info">100%</span>
            </div>
            <div class="d-flex justify-content-between align-items-center">
              <span>Security Level</span>
              <span class="badge bg-warning">Standard</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Detailed Information -->
      <div class="col-lg-8">
        <!-- Personal Information -->
        <div class="card mb-4">
          <div class="card-header">
            <h5 class="mb-0">
              <i class="fas fa-user me-2"></i>
              Personal Information
            </h5>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label text-muted">First Name</label>
                  <div class="form-control-plaintext border-bottom">{{user.firstName}}</div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label text-muted">Last Name</label>
                  <div class="form-control-plaintext border-bottom">{{user.lastName}}</div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label text-muted">Username</label>
                  <div class="form-control-plaintext border-bottom">{{user.username}}</div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label text-muted">Email Address</label>
                  <div class="form-control-plaintext border-bottom">{{user.email}}</div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label text-muted">User ID</label>
                  <div class="form-control-plaintext border-bottom">
                    <code>{{user._id}}</code>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Account Activity -->
        <div class="card mb-4">
          <div class="card-header">
            <h5 class="mb-0">
              <i class="fas fa-clock me-2"></i>
              Account Activity
            </h5>
          </div>
          <div class="card-body">
            <div class="timeline">
              <div class="timeline-item">
                <div class="timeline-marker bg-success"></div>
                <div class="timeline-content">
                  <h6 class="mb-1">Account Created</h6>
                  <p class="text-muted mb-0">Your account was successfully created on {{formatDateTime(user.createdAt)}}</p>
                </div>
              </div>
              <div class="timeline-item">
                <div class="timeline-marker bg-info"></div>
                <div class="timeline-content">
                  <h6 class="mb-1">Profile Updated</h6>
                  <p class="text-muted mb-0">Last profile update on {{formatDateTime(user.updatedAt)}}</p>
                </div>
              </div>
              <div class="timeline-item">
                <div class="timeline-marker bg-primary"></div>
                <div class="timeline-content">
                  <h6 class="mb-1">Current Session</h6>
                  <p class="text-muted mb-0">You're currently browsing the Cat API application</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Available Actions -->
        <div class="card">
          <div class="card-header">
            <h5 class="mb-0">
              <i class="fas fa-tools me-2"></i>
              Available Actions
            </h5>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-6">
                <div class="d-grid">
                  <button class="btn btn-outline-primary mb-2" disabled>
                    <i class="fas fa-edit me-2"></i>
                    Edit Profile
                  </button>
                </div>
              </div>
              <div class="col-md-6">
                <div class="d-grid">
                  <button class="btn btn-outline-info mb-2" disabled>
                    <i class="fas fa-key me-2"></i>
                    Change Password
                  </button>
                </div>
              </div>
              <div class="col-md-6">
                <div class="d-grid">
                  <button class="btn btn-outline-secondary mb-2" (click)="downloadUserData()">
                    <i class="fas fa-download me-2"></i>
                    Export Data
                  </button>
                </div>
              </div>
              <div class="col-md-6">
                <div class="d-grid">
                  <button class="btn btn-outline-danger mb-2" disabled>
                    <i class="fas fa-trash me-2"></i>
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
            <div class="alert alert-info mt-3">
              <i class="fas fa-info-circle me-2"></i>
              <strong>Note:</strong> Some features are disabled in this demo version.
              In a full implementation, you would be able to edit your profile and manage your account settings.
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .form-control-plaintext {
      padding: 0.375rem 0;
      background-color: transparent;
      border: 0;
      border-bottom: 1px solid #dee2e6 !important;
      border-radius: 0;
    }

    .timeline {
      position: relative;
      padding-left: 30px;
    }

    .timeline::before {
      content: '';
      position: absolute;
      left: 15px;
      top: 0;
      bottom: 0;
      width: 2px;
      background-color: #dee2e6;
    }

    .timeline-item {
      position: relative;
      margin-bottom: 30px;
    }

    .timeline-marker {
      position: absolute;
      left: -37px;
      top: 5px;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      border: 2px solid #fff;
      box-shadow: 0 0 0 2px #dee2e6;
    }

    .timeline-content h6 {
      color: #495057;
      margin-bottom: 5px;
    }

    .timeline-content p {
      font-size: 0.875rem;
      line-height: 1.5;
    }

    code {
      background-color: #f8f9fa;
      padding: 0.2rem 0.4rem;
      border-radius: 0.25rem;
      font-size: 0.875rem;
    }
  `]
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  loading = false;
  errorMessage = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    // First try to get user from current state
    this.user = this.authService.getCurrentUser();

    if (this.user) {
      // Refresh profile from server to get latest data
      this.refreshProfile();
    } else {
      // If no user in state, try to fetch from server
      this.refreshProfile();
    }
  }

  refreshProfile(): void {
    this.loading = true;
    this.errorMessage = '';

    this.authService.getProfile().subscribe({
      next: (user) => {
        this.user = user;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        if (error.status === 401) {
          console.log('Unauthorized',error);
          this.errorMessage = 'Your session has expired. Please log in again.';
        } else {
          this.errorMessage = 'Failed to load your profile. Please try again.';
        }
        console.error('Profile error:', error);
      }
    });
  }

  getInitials(): string {
    if (!this.user) return '';
    return `${this.user.firstName.charAt(0)}${this.user.lastName.charAt(0)}`.toUpperCase();
  }

  formatDate(dateString: Date): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  formatDateTime(dateString: Date): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  downloadUserData(): void {
    if (!this.user) return;

    const userData = {
      profile: this.user,
      exportedAt: new Date().toISOString(),
      note: 'This is your personal data export from Cat API application.'
    };

    const dataStr = JSON.stringify(userData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `cat-api-profile-${this.user.username}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

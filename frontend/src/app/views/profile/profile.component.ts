import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.models';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="profile-container">
      <!-- Header Section -->
      <div class="profile-header" *ngIf="user">
        <div class="header-content">
          <div class="profile-avatar">
            <div class="avatar-circle">
              {{getInitials()}}
            </div>
            <div class="avatar-status"></div>
          </div>
          <div class="profile-info">
            <h1 class="profile-name">{{user.firstName}} {{user.lastName}}</h1>
            <p class="profile-username">&#64;{{user.username}}</p>
            <p class="profile-email">{{user.email}}</p>
          </div>
          <div class="profile-actions">
            <button
              class="refresh-btn"
              (click)="refreshProfile()"
              [disabled]="loading">
              <div *ngIf="loading" class="loading-spinner"></div>
              <svg *ngIf="!loading" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M23 4v6h-6"></path>
                <path d="M1 20v-6h6"></path>
                <path d="m3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div class="loading-state" *ngIf="loading && !user">
        <div class="loading-spinner large"></div>
        <p class="loading-text">Loading your profile...</p>
      </div>

      <!-- Error State -->
      <div class="error-state" *ngIf="errorMessage">
        <div class="error-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
        <p class="error-message">{{errorMessage}}</p>
      </div>

      <!-- Profile Content -->
      <div class="profile-content" *ngIf="user">
        <!-- Stats Overview -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon success">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22,4 12,14.01 9,11.01"></polyline>
              </svg>
            </div>
            <div class="stat-content">
              <h3 class="stat-title">Account Status</h3>
              <p class="stat-value success">Active</p>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon info">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 11H1l6-6 6 6zm9 0v6l-6-6 6-6z"></path>
              </svg>
            </div>
            <div class="stat-content">
              <h3 class="stat-title">Profile Completion</h3>
              <p class="stat-value info">100%</p>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon warning">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
            </div>
            <div class="stat-content">
              <h3 class="stat-title">Security Level</h3>
              <p class="stat-value warning">Standard</p>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon primary">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </div>
            <div class="stat-content">
              <h3 class="stat-title">Member Since</h3>
              <p class="stat-value primary">{{formatDate(user.createdAt)}}</p>
            </div>
          </div>
        </div>

        <!-- Information Sections -->
        <div class="info-sections">
          <!-- Personal Information -->
          <div class="info-section">
            <div class="section-header">
              <h2 class="section-title">Personal Information</h2>
              <div class="section-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
            </div>
            <div class="info-grid">
              <div class="info-item">
                <label class="info-label">First Name</label>
                <div class="info-value">{{user.firstName}}</div>
              </div>
              <div class="info-item">
                <label class="info-label">Last Name</label>
                <div class="info-value">{{user.lastName}}</div>
              </div>
              <div class="info-item">
                <label class="info-label">Username</label>
                <div class="info-value">{{user.username}}</div>
              </div>
              <div class="info-item">
                <label class="info-label">Email Address</label>
                <div class="info-value">{{user.email}}</div>
              </div>
              <div class="info-item">
                <label class="info-label">User ID</label>
                <div class="info-value code">{{user._id}}</div>
              </div>
            </div>
          </div>

          <!-- Account Activity -->
          <div class="info-section">
            <div class="section-header">
              <h2 class="section-title">Account Activity</h2>
              <div class="section-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12,6 12,12 16,14"></polyline>
                </svg>
              </div>
            </div>
            <div class="activity-timeline">
              <div class="timeline-item">
                <div class="timeline-marker success"></div>
                <div class="timeline-content">
                  <h4 class="timeline-title">Account Created</h4>
                  <p class="timeline-description">Your account was successfully created on {{formatDateTime(user.createdAt)}}</p>
                </div>
              </div>
              <div class="timeline-item">
                <div class="timeline-marker info"></div>
                <div class="timeline-content">
                  <h4 class="timeline-title">Profile Updated</h4>
                  <p class="timeline-description">Last profile update on {{formatDateTime(user.updatedAt)}}</p>
                </div>
              </div>
              <div class="timeline-item">
                <div class="timeline-marker primary"></div>
                <div class="timeline-content">
                  <h4 class="timeline-title">Current Session</h4>
                  <p class="timeline-description">You're currently browsing the Cat API application</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="info-section">
            <div class="section-header">
              <h2 class="section-title">Quick Actions</h2>
              <div class="section-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M12 1v6M12 17v6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24M1 12h6M17 12h6M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24"></path>
                </svg>
              </div>
            </div>
            <div class="actions-grid">
              <button class="action-btn disabled" disabled>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
                <span>Edit Profile</span>
              </button>
              <button class="action-btn disabled" disabled>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <circle cx="12" cy="16" r="1"></circle>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                <span>Change Password</span>
              </button>
              <button class="action-btn primary" (click)="downloadUserData()">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7,10 12,15 17,10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                <span>Export Data</span>
              </button>
              <button class="action-btn danger disabled" disabled>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="3,6 5,6 21,6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  <line x1="10" y1="11" x2="10" y2="17"></line>
                  <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
                <span>Delete Account</span>
              </button>
            </div>
            <div class="demo-notice">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              <span>Some features are disabled in this demo version. In a full implementation, you would be able to edit your profile and manage your account settings.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      --secondary-gradient: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      --success-gradient: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
      --warning-gradient: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
      --info-gradient: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
      --dark-gradient: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
      
      --bg-primary: #ffffff;
      --bg-secondary: #f8fafc;
      --bg-card: #ffffff;
      --border-color: #e2e8f0;
      --text-primary: #1a202c;
      --text-secondary: #4a5568;
      --text-muted: #718096;
      
      --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.05);
      --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.05);
      --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
      --shadow-xl: 0 25px 50px rgba(0, 0, 0, 0.15);
      
      --radius-sm: 8px;
      --radius-md: 12px;
      --radius-lg: 16px;
      --radius-xl: 24px;
    }

    .profile-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem 1rem;
      background: var(--bg-secondary);
      min-height: 100vh;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    }

    /* Header Section */
    .profile-header {
      background: var(--bg-card);
      border-radius: var(--radius-xl);
      padding: 3rem;
      margin-bottom: 2rem;
      box-shadow: var(--shadow-lg);
      position: relative;
      overflow: hidden;
    }

    .profile-header::before {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      width: 200px;
      height: 200px;
      background: var(--primary-gradient);
      border-radius: 50%;
      opacity: 0.1;
      transform: translate(50%, -50%);
    }

    .header-content {
      display: flex;
      align-items: center;
      gap: 2rem;
      position: relative;
      z-index: 1;
    }

    .profile-avatar {
      position: relative;
    }

    .avatar-circle {
      width: 120px;
      height: 120px;
      background: var(--primary-gradient);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2.5rem;
      font-weight: 700;
      color: white;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      box-shadow: var(--shadow-lg);
    }

    .avatar-status {
      position: absolute;
      bottom: 8px;
      right: 8px;
      width: 24px;
      height: 24px;
      background: var(--success-gradient);
      border: 4px solid white;
      border-radius: 50%;
      box-shadow: var(--shadow-md);
    }

    .profile-info {
      flex: 1;
    }

    .profile-name {
      font-size: 2.5rem;
      font-weight: 800;
      color: var(--text-primary);
      margin: 0 0 0.5rem 0;
      letter-spacing: -0.02em;
    }

    .profile-username {
      font-size: 1.125rem;
      color: var(--text-secondary);
      margin: 0 0 0.25rem 0;
      font-weight: 500;
    }

    .profile-email {
      font-size: 1rem;
      color: var(--text-muted);
      margin: 0;
    }

    .profile-actions {
      margin-left: auto;
    }

    .refresh-btn {
      padding: 1rem;
      background: var(--bg-card);
      border: 2px solid var(--border-color);
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-secondary);
    }

    .refresh-btn:hover:not(:disabled) {
      border-color: #667eea;
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
      color: #667eea;
    }

    .refresh-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    /* Loading States */
    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 4rem 2rem;
      text-align: center;
    }

    .loading-spinner {
      width: 24px;
      height: 24px;
      border: 3px solid var(--border-color);
      border-top: 3px solid #667eea;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    .loading-spinner.large {
      width: 48px;
      height: 48px;
      border-width: 4px;
    }

    .loading-text {
      margin-top: 1rem;
      color: var(--text-muted);
      font-size: 1.125rem;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    /* Error State */
    .error-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 4rem 2rem;
      text-align: center;
      background: var(--bg-card);
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-lg);
    }

    .error-icon {
      color: #e53e3e;
      margin-bottom: 1rem;
    }

    .error-message {
      color: var(--text-primary);
      font-size: 1.125rem;
      font-weight: 500;
      margin: 0;
    }

    /* Profile Content */
    .profile-content {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    /* Stats Grid */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: var(--bg-card);
      border-radius: var(--radius-lg);
      padding: 2rem;
      box-shadow: var(--shadow-md);
      display: flex;
      align-items: center;
      gap: 1.5rem;
      transition: all 0.3s ease;
      border: 1px solid var(--border-color);
    }

    .stat-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-xl);
    }

    .stat-icon {
      width: 60px;
      height: 60px;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .stat-icon.success { background: var(--success-gradient); }
    .stat-icon.info { background: var(--info-gradient); }
    .stat-icon.warning { background: var(--warning-gradient); }
    .stat-icon.primary { background: var(--primary-gradient); }

    .stat-content {
      flex: 1;
    }

    .stat-title {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--text-muted);
      margin: 0 0 0.5rem 0;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .stat-value {
      font-size: 1.5rem;
      font-weight: 700;
      margin: 0;
    }

    .stat-value.success { color: #38a169; }
    .stat-value.info { color: #3182ce; }
    .stat-value.warning { color: #d69e2e; }
    .stat-value.primary { color: #667eea; }

    /* Info Sections */
    .info-sections {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .info-section {
      background: var(--bg-card);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-md);
      border: 1px solid var(--border-color);
      overflow: hidden;
    }

    .section-header {
      padding: 2rem 2rem 0 2rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 2rem;
    }

    .section-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0;
      letter-spacing: -0.01em;
    }

    .section-icon {
      color: var(--text-muted);
      padding: 0.75rem;
      background: var(--bg-secondary);
      border-radius: var(--radius-sm);
    }

    /* Info Grid */
    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      padding: 0 2rem 2rem 2rem;
    }

    .info-item {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .info-label {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .info-value {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--text-primary);
      padding-bottom: 0.75rem;
      border-bottom: 2px solid var(--border-color);
      transition: border-color 0.2s ease;
    }

    .info-value.code {
      font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
      background: var(--bg-secondary);
      padding: 0.75rem;
      border-radius: var(--radius-sm);
      font-size: 0.875rem;
      border-bottom: none;
      color: var(--text-secondary);
    }

    /* Timeline */
    .activity-timeline {
      padding: 0 2rem 2rem 2rem;
      position: relative;
    }

    .activity-timeline::before {
      content: '';
      position: absolute;
      left: 3.5rem;
      top: 0;
      bottom: 2rem;
      width: 2px;
      background: linear-gradient(to bottom, var(--border-color), transparent);
    }

    .timeline-item {
      position: relative;
      padding-left: 4rem;
      margin-bottom: 2rem;
    }

    .timeline-item:last-child {
      margin-bottom: 0;
    }

    .timeline-marker {
      position: absolute;
      left: 0;
      top: 0.25rem;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: var(--shadow-md);
    }

    .timeline-marker.success { background: var(--success-gradient); }
    .timeline-marker.info { background: var(--info-gradient); }
    .timeline-marker.primary { background: var(--primary-gradient); }

    .timeline-content {
      background: var(--bg-secondary);
      padding: 1.5rem;
      border-radius: var(--radius-md);
      border-left: 4px solid var(--border-color);
    }

    .timeline-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0 0 0.5rem 0;
    }

    .timeline-description {
      font-size: 0.875rem;
      color: var(--text-muted);
      margin: 0;
      line-height: 1.6;
    }

    /* Actions Grid */
    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
      padding: 0 2rem 2rem 2rem;
    }

    .action-btn {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1.25rem 1.5rem;
      background: var(--bg-card);
      border: 2px solid var(--border-color);
      border-radius: var(--radius-md);
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      text-align: left;
    }

    .action-btn:hover:not(.disabled) {
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }

    .action-btn.primary {
      border-color: #667eea;
      color: #667eea;
    }

    .action-btn.primary:hover:not(.disabled) {
      background: #667eea;
      color: white;
    }

    .action-btn.danger {
      border-color: #e53e3e;
      color: #e53e3e;
    }

    .action-btn.danger:hover:not(.disabled) {
      background: #e53e3e;
      color: white;
    }

    .action-btn.disabled {
      opacity: 0.5;
      cursor: not-allowed;
      color: var(--text-muted);
    }

    .demo-notice {
      margin: 2rem 2rem 0 2rem;
      padding: 1.5rem;
      background: #fef7e0;
      border: 1px solid #f6e05e;
      border-radius: var(--radius-md);
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      color: #744210;
      font-size: 0.875rem;
      line-height: 1.6;
    }

    .demo-notice svg {
      flex-shrink: 0;
      margin-top: 0.125rem;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .profile-container {
        padding: 1rem;
      }

      .profile-header {
        padding: 2rem;
        margin-bottom: 1.5rem;
      }

      .header-content {
        flex-direction: column;
        text-align: center;
        gap: 1.5rem;
      }

      .profile-name {
        font-size: 2rem;
      }

      .stats-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
      }

      .stat-card {
        padding: 1.5rem;
      }

      .info-grid {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }

      .actions-grid {
        grid-template-columns: 1fr;
      }

      .section-header {
        padding: 1.5rem 1.5rem 0 1.5rem;
      }

      .info-grid,
      .activity-timeline,
      .actions-grid {
        padding-left: 1.5rem;
        padding-right: 1.5rem;
      }

      .demo-notice {
        margin-left: 1.5rem;
        margin-right: 1.5rem;
      }
    }

    /* Dark mode support */
    @media (prefers-color-scheme: dark) {
      :host {
        --bg-primary: #1a202c;
        --bg-secondary: #2d3748;
        --bg-card: #4a5568;
        --border-color: #718096;
        --text-primary: #f7fafc;
        --text-secondary: #e2e8f0;
        --text-muted: #a0aec0;
      }
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

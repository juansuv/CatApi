import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CatService } from '../../services/cat.service';
import { CatBreed, CatImage } from '../../models/cat.models';

@Component({
  selector: 'app-cat-breeds',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="row">
      <div class="col-12">
        <div class="page-header text-center mb-5">
          <h1 class="display-4 fw-bold mb-3">
            <i class="fas fa-paw me-3"></i>
            Discover Cat Breeds
          </h1>
          <p class="lead text-muted">Explore the wonderful world of cat breeds and their unique characteristics</p>
        </div>
      </div>
    </div>

    <!-- Breed Selection Dropdown -->
    <div class="row mb-5">
      <div class="col-md-8 col-lg-6 mx-auto">
        <div class="card selection-card">
          <div class="card-body text-center">
            <div class="selection-icon mb-3">
              <i class="fas fa-cat"></i>
            </div>
            <h5 class="card-title mb-3">Choose Your Favorite Breed</h5>
            <select
              class="form-select form-select-lg"
              [(ngModel)]="selectedBreedId"
              (change)="onBreedSelect()"
              [disabled]="loading">
              <option value="">🐱 Select a cat breed to explore...</option>
              <option
                *ngFor="let breed of breeds"
                [value]="breed.id">
                {{breed.name}} ({{breed.origin}})
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>



    <!-- Breeds Table -->
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h5 class="mb-0">All Cat Breeds</h5>
          </div>
          <div class="card-body">
            <div *ngIf="loading" class="text-center">
              <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>

            <div class="table-responsive" *ngIf="!loading">
              <table class="table table-striped table-hover">
                <thead class="table-dark">
                  <tr>
                    <th>Name</th>
                    <th>Origin</th>
                    <th>Life Span</th>
                    <th>Weight (kg)</th>
                    <th>Temperament</th>
                    <th>Energy Level</th>
                    <th>Grooming</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let breed of breeds">
                    <td><strong>{{breed.name}}</strong></td>
                    <td>{{breed.origin}}</td>
                    <td>{{breed.life_span}} years</td>
                    <td>{{breed.weight.metric}}</td>
                    <td>
                      <small>{{breed.temperament | slice:0:50}}{{breed.temperament.length > 50 ? '...' : ''}}</small>
                    </td>
                    <td>
                      <div class="progress" style="height: 20px;">
                        <div
                          class="progress-bar"
                          [style.width.%]="breed.energy_level * 20"
                          [attr.aria-valuenow]="breed.energy_level"
                          aria-valuemin="0"
                          aria-valuemax="5">
                          {{breed.energy_level}}/5
                        </div>
                      </div>
                    </td>
                    <td>
                      <div class="progress" style="height: 20px;">
                        <div
                          class="progress-bar bg-info"
                          [style.width.%]="breed.grooming * 20"
                          [attr.aria-valuenow]="breed.grooming"
                          aria-valuemin="0"
                          aria-valuemax="5">
                          {{breed.grooming}}/5
                        </div>
                      </div>
                    </td>
                    <td>
                      <button
                        class="btn btn-sm btn-primary"
                        (click)="selectBreed(breed.id)">
                        View Details
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-header {
      padding: 2rem 0;
      background: linear-gradient(135deg, rgba(26, 133, 255, 0.1), rgba(6, 182, 212, 0.1));
      border-radius: var(--radius-xl);
      margin-bottom: 3rem;
    }

    .selection-card {
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.9));
      border: none;
      box-shadow: var(--shadow-lg);
    }

    .selection-icon {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--primary-500), var(--success-500));
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto;
      font-size: 1.2rem;
    }

    .form-select-lg {
      padding: 1rem 1.25rem;
      font-size: 1rem;
      border-radius: var(--radius-lg);
      border: 2px solid var(--gray-200);
      background: rgba(255, 255, 255, 0.9);
    }

    .carousel-item img {
      height: 350px;
      object-fit: cover;
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-md);
    }

    .progress {
      font-size: 0.75rem;
      height: 20px;
      border-radius: var(--radius-md);
    }

    .table th {
      font-size: 0.9rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .table td {
      font-size: 0.85rem;
      vertical-align: middle;
      padding: 1.25rem 1rem;
    }

    .list-group-item {
      border: none;
      padding: 0.75rem 0;
      background: transparent;
      border-bottom: 1px solid var(--gray-200);
    }

    .list-group-item:last-child {
      border-bottom: none;
    }

    .breed-detail-card {
      animation: slideInUp 0.5s ease-out;
    }

    @keyframes slideInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `]
})
export class CatBreedsComponent implements OnInit {
  @ViewChild('breedDetailsSection') breedDetailsSection!: ElementRef;

  breeds: CatBreed[] = [];
  selectedBreed: CatBreed | null = null;
  selectedBreedId: string = '';
  breedImages: CatImage[] = [];
  loading = false;
  loadingImages = false;

  constructor(private catService: CatService) {}

  ngOnInit(): void {
    this.loadBreeds();
  }

  loadBreeds(): void {
    this.loading = true;
    this.catService.getAllBreeds().subscribe({
      next: (breeds) => {
        this.breeds = breeds;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading breeds:', error);
        this.loading = false;
      }
    });
  }

  onBreedSelect(): void {
    if (this.selectedBreedId) {
      this.selectBreed(this.selectedBreedId);
    }
  }

  selectBreed(breedId: string): void {
    this.selectedBreedId = breedId;

    this.catService.getBreedById(breedId).subscribe({
      next: (breed) => {
        this.selectedBreed = breed;
        this.loadBreedImages(breedId);
        this.scrollToBreedDetails();
      },
      error: (error) => {
        console.error('Error loading breed details:', error);
      }
    });
  }

  loadBreedImages(breedId: string): void {
    this.loadingImages = true;
    this.catService.getImagesByBreedId(breedId, 5).subscribe({
      next: (images) => {
        this.breedImages = images;
        this.loadingImages = false;
      },
      error: (error) => {
        console.error('Error loading breed images:', error);
        this.loadingImages = false;
        this.breedImages = [];
      }
    });
  }

  private scrollToBreedDetails(): void {
    setTimeout(() => {
      if (this.breedDetailsSection) {
        this.breedDetailsSection.nativeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest'
        });
      }
    }, 100);
  }
}

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { CatService } from '../../services/cat.service';
import { CatBreed, CatImage } from '../../models/cat.models';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="row">
      <div class="col-12">
        <h1 class="mb-4">Search Cat Breeds</h1>
      </div>
    </div>

    <!-- Search Form -->
    <div class="row mb-4">
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <form [formGroup]="searchForm" class="d-flex">
              <input 
                type="text" 
                class="form-control me-2" 
                placeholder="Search for cat breeds..." 
                formControlName="searchQuery">
              <button 
                type="button" 
                class="btn btn-primary" 
                (click)="performSearch()"
                [disabled]="loading">
                <span *ngIf="loading" class="spinner-border spinner-border-sm me-2"></span>
                Search
              </button>
              <button 
                type="button" 
                class="btn btn-secondary ms-2" 
                (click)="clearSearch()">
                Clear
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Search Results Info -->
    <div class="row mb-3" *ngIf="searchPerformed">
      <div class="col-12">
        <div class="alert alert-info" *ngIf="searchResults.length > 0">
          Found {{searchResults.length}} breed(s) matching your search.
        </div>
        <div class="alert alert-warning" *ngIf="searchResults.length === 0 && !loading">
          No breeds found matching your search criteria. Try a different search term.
        </div>
      </div>
    </div>

    <!-- Loading Spinner -->
    <div class="row" *ngIf="loading">
      <div class="col-12 text-center">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>

    <!-- Search Results Table -->
    <div class="row" *ngIf="!loading && searchResults.length > 0">
      <div class="col-12">
        <div class="card">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="mb-0">Search Results</h5>
            <span class="badge bg-primary">{{filteredResults.length}} results</span>
          </div>
          <div class="card-body">
            <!-- Table Filters -->
            <div class="row mb-3">
              <div class="col-md-4">
                <label for="originFilter" class="form-label">Filter by Origin:</label>
                <select 
                  id="originFilter" 
                  class="form-select" 
                  [(ngModel)]="originFilter" 
                  (change)="applyFilters()">
                  <option value="">All Origins</option>
                  <option *ngFor="let origin of uniqueOrigins" [value]="origin">{{origin}}</option>
                </select>
              </div>
              <div class="col-md-4">
                <label for="energyFilter" class="form-label">Min Energy Level:</label>
                <select 
                  id="energyFilter" 
                  class="form-select" 
                  [(ngModel)]="energyLevelFilter" 
                  (change)="applyFilters()">
                  <option value="0">Any</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                  <option value="5">5</option>
                </select>
              </div>
              <div class="col-md-4">
                <label for="groomingFilter" class="form-label">Max Grooming Need:</label>
                <select 
                  id="groomingFilter" 
                  class="form-select" 
                  [(ngModel)]="groomingFilter" 
                  (change)="applyFilters()">
                  <option value="5">Any</option>
                  <option value="1">Low (1)</option>
                  <option value="2">Low-Medium (1-2)</option>
                  <option value="3">Medium (1-3)</option>
                  <option value="4">High (1-4)</option>
                </select>
              </div>
            </div>

            <div class="table-responsive">
              <table class="table table-striped table-hover">
                <thead class="table-dark">
                  <tr>
                    <th (click)="sortBy('name')" style="cursor: pointer;">
                      Name 
                      <i class="fas fa-sort" *ngIf="sortField !== 'name'"></i>
                      <i class="fas fa-sort-up" *ngIf="sortField === 'name' && sortDirection === 'asc'"></i>
                      <i class="fas fa-sort-down" *ngIf="sortField === 'name' && sortDirection === 'desc'"></i>
                    </th>
                    <th (click)="sortBy('origin')" style="cursor: pointer;">
                      Origin
                      <i class="fas fa-sort" *ngIf="sortField !== 'origin'"></i>
                      <i class="fas fa-sort-up" *ngIf="sortField === 'origin' && sortDirection === 'asc'"></i>
                      <i class="fas fa-sort-down" *ngIf="sortField === 'origin' && sortDirection === 'desc'"></i>
                    </th>
                    <th>Life Span</th>
                    <th>Weight</th>
                    <th>Energy Level</th>
                    <th>Grooming</th>
                    <th>Child Friendly</th>
                    <th>Temperament</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let breed of filteredResults" 
                      (click)="selectBreed(breed)" 
                      style="cursor: pointer;"
                      [class.table-active]="selectedBreed?.id === breed.id">
                    <td><strong>{{breed.name}}</strong></td>
                    <td>{{breed.origin}}</td>
                    <td>{{breed.life_span}} years</td>
                    <td>{{breed.weight.metric}} kg</td>
                    <td>
                      <div class="d-flex align-items-center">
                        <span class="me-2">{{breed.energy_level}}/5</span>
                        <div class="progress flex-grow-1" style="height: 15px;">
                          <div 
                            class="progress-bar bg-success" 
                            [style.width.%]="breed.energy_level * 20">
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div class="d-flex align-items-center">
                        <span class="me-2">{{breed.grooming}}/5</span>
                        <div class="progress flex-grow-1" style="height: 15px;">
                          <div 
                            class="progress-bar bg-info" 
                            [style.width.%]="breed.grooming * 20">
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div class="d-flex align-items-center">
                        <span class="me-2">{{breed.child_friendly}}/5</span>
                        <div class="progress flex-grow-1" style="height: 15px;">
                          <div 
                            class="progress-bar bg-warning" 
                            [style.width.%]="breed.child_friendly * 20">
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <small>{{breed.temperament | slice:0:40}}{{breed.temperament.length > 40 ? '...' : ''}}</small>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Selected Breed Details -->
    <div class="row mt-4" *ngIf="selectedBreed" #breedDetailsSection>
      <div class="col-12">
        <div class="card border-primary breed-detail-card">
          <div class="card-header bg-primary text-white">
            <h5 class="mb-0">{{selectedBreed.name}} - Detailed Information</h5>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-6">
                <p><strong>Description:</strong></p>
                <p>{{selectedBreed.description}}</p>
                <p><strong>Temperament:</strong> {{selectedBreed.temperament}}</p>
                <p><strong>Origin:</strong> {{selectedBreed.origin}}</p>
                <p><strong>Life Span:</strong> {{selectedBreed.life_span}} years</p>
                <p><strong>Weight:</strong> {{selectedBreed.weight.metric}} kg ({{selectedBreed.weight.imperial}} lbs)</p>
                
                <h6 class="mt-4">Characteristics:</h6>
                <div class="row">
                  <div class="col-6 mb-2">
                    <small class="text-muted">Adaptability:</small>
                    <div class="progress" style="height: 15px;">
                      <div class="progress-bar" [style.width.%]="selectedBreed.adaptability * 20">{{selectedBreed.adaptability}}/5</div>
                    </div>
                  </div>
                  <div class="col-6 mb-2">
                    <small class="text-muted">Affection Level:</small>
                    <div class="progress" style="height: 15px;">
                      <div class="progress-bar bg-success" [style.width.%]="selectedBreed.affection_level * 20">{{selectedBreed.affection_level}}/5</div>
                    </div>
                  </div>
                  <div class="col-6 mb-2">
                    <small class="text-muted">Intelligence:</small>
                    <div class="progress" style="height: 15px;">
                      <div class="progress-bar bg-info" [style.width.%]="selectedBreed.intelligence * 20">{{selectedBreed.intelligence}}/5</div>
                    </div>
                  </div>
                  <div class="col-6 mb-2">
                    <small class="text-muted">Social Needs:</small>
                    <div class="progress" style="height: 15px;">
                      <div class="progress-bar bg-warning" [style.width.%]="selectedBreed.social_needs * 20">{{selectedBreed.social_needs}}/5</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="col-md-6">
                <h6>Image Gallery</h6>
                <div *ngIf="loadingImages" class="text-center">
                  <div class="spinner-border" role="status">
                    <span class="visually-hidden">Loading images...</span>
                  </div>
                  <p class="mt-2 text-muted">Loading breed images...</p>
                </div>
                
                <div *ngIf="breedImages.length === 0 && !loadingImages" class="text-center text-muted">
                  <i class="fas fa-image fa-3x mb-3"></i>
                  <p>No images available for this breed</p>
                </div>
                
                <div id="searchBreedCarousel" class="carousel slide" data-bs-ride="carousel" *ngIf="breedImages.length > 0">
                  <div class="carousel-indicators" *ngIf="breedImages.length > 1">
                    <button 
                      *ngFor="let image of breedImages; let i = index"
                      type="button" 
                      data-bs-target="#searchBreedCarousel" 
                      [attr.data-bs-slide-to]="i" 
                      [class.active]="i === 0">
                    </button>
                  </div>
                  <div class="carousel-inner">
                    <div 
                      *ngFor="let image of breedImages; let i = index"
                      class="carousel-item" 
                      [class.active]="i === 0">
                      <img [src]="image.url" class="d-block w-100 search-cat-image" [alt]="selectedBreed.name">
                    </div>
                  </div>
                  <button class="carousel-control-prev" type="button" data-bs-target="#searchBreedCarousel" data-bs-slide="prev" *ngIf="breedImages.length > 1">
                    <span class="carousel-control-prev-icon"></span>
                  </button>
                  <button class="carousel-control-next" type="button" data-bs-target="#searchBreedCarousel" data-bs-slide="next" *ngIf="breedImages.length > 1">
                    <span class="carousel-control-next-icon"></span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .table-active {
      background-color: #e3f2fd !important;
    }
    .progress {
      font-size: 0.7rem;
    }
    .table th {
      font-size: 0.9rem;
    }
    .table td {
      font-size: 0.85rem;
      vertical-align: middle;
    }
    .progress-bar {
      text-align: center;
      line-height: 15px;
    }
    .search-cat-image {
      height: 300px;
      object-fit: cover;
      border-radius: 0.5rem;
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
export class SearchComponent implements OnInit {
  @ViewChild('breedDetailsSection') breedDetailsSection!: ElementRef;

  searchForm: FormGroup;
  searchResults: CatBreed[] = [];
  filteredResults: CatBreed[] = [];
  selectedBreed: CatBreed | null = null;
  breedImages: CatImage[] = [];
  loading = false;
  loadingImages = false;
  searchPerformed = false;

  // Filters
  originFilter = '';
  energyLevelFilter = 0;
  groomingFilter = 5;
  uniqueOrigins: string[] = [];

  // Sorting
  sortField = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(
    private fb: FormBuilder,
    private catService: CatService
  ) {
    this.searchForm = this.fb.group({
      searchQuery: ['']
    });
  }

  ngOnInit(): void {
    // Auto-search as user types (with debounce)
    this.searchForm.get('searchQuery')?.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap(query => {
          if (query && query.trim().length > 2) {
            this.loading = true;
            return this.catService.searchBreeds(query.trim());
          }
          return [];
        })
      )
      .subscribe({
        next: (results) => {
          this.searchResults = results;
          this.searchPerformed = true;
          this.applyFilters();
          this.updateUniqueOrigins();
          this.loading = false;
        },
        error: (error) => {
          console.error('Search error:', error);
          this.loading = false;
        }
      });
  }

  performSearch(): void {
    const query = this.searchForm.get('searchQuery')?.value;
    if (query && query.trim()) {
      this.loading = true;
      this.catService.searchBreeds(query.trim()).subscribe({
        next: (results) => {
          this.searchResults = results;
          this.searchPerformed = true;
          this.applyFilters();
          this.updateUniqueOrigins();
          this.loading = false;
        },
        error: (error) => {
          console.error('Search error:', error);
          this.loading = false;
        }
      });
    }
  }

  clearSearch(): void {
    this.searchForm.reset();
    this.searchResults = [];
    this.filteredResults = [];
    this.selectedBreed = null;
    this.breedImages = [];
    this.searchPerformed = false;
    this.originFilter = '';
    this.energyLevelFilter = 0;
    this.groomingFilter = 5;
  }

  applyFilters(): void {
    let filtered = [...this.searchResults];

    if (this.originFilter) {
      filtered = filtered.filter(breed => breed.origin === this.originFilter);
    }

    if (this.energyLevelFilter > 0) {
      filtered = filtered.filter(breed => breed.energy_level >= this.energyLevelFilter);
    }

    if (this.groomingFilter < 5) {
      filtered = filtered.filter(breed => breed.grooming <= this.groomingFilter);
    }

    this.filteredResults = this.sortResults(filtered);
  }

  updateUniqueOrigins(): void {
    this.uniqueOrigins = [...new Set(this.searchResults.map(breed => breed.origin))].sort();
  }

  sortBy(field: string): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.applyFilters();
  }

  private sortResults(results: CatBreed[]): CatBreed[] {
    if (!this.sortField) return results;

    return results.sort((a, b) => {
      const aValue = (a as any)[this.sortField];
      const bValue = (b as any)[this.sortField];
      
      let comparison = 0;
      if (aValue > bValue) comparison = 1;
      if (aValue < bValue) comparison = -1;
      
      return this.sortDirection === 'asc' ? comparison : -comparison;
    });
  }

  selectBreed(breed: CatBreed): void {
    this.selectedBreed = breed;
    this.loadBreedImages(breed.id);
    this.scrollToBreedDetails();
  }

  loadBreedImages(breedId: string): void {
    this.loadingImages = true;
    this.breedImages = [];
    
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
    }, 150);
  }
}
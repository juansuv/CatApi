import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CatService } from './cat.service';
import { CatBreed, CatImage } from '../models/cat.models';
import { environment } from '../../environments/environment';

describe('CatService', () => {
  let service: CatService;
  let httpMock: HttpTestingController;

  const mockBreed: CatBreed = {
    id: '1',
    name: 'Persian',
    description: 'A fluffy cat',
    temperament: 'Calm',
    origin: 'Iran',
    life_span: '12-15',
    weight: { imperial: '7-12', metric: '3-5' },
    adaptability: 5,
    affection_level: 5,
    child_friendly: 4,
    dog_friendly: 2,
    energy_level: 3,
    grooming: 5,
    health_issues: 3,
    intelligence: 3,
    shedding_level: 5,
    social_needs: 4,
    stranger_friendly: 2,
    vocalisation: 1,
    experimental: 0,
    hairless: 0,
    natural: 1,
    rare: 0,
    rex: 0,
    suppressed_tail: 0,
    short_legs: 0,
    hypoallergenic: 0
  };

  const mockImage: CatImage = {
    id: 'img1',
    url: 'https://example.com/cat.jpg',
    width: 500,
    height: 400
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CatService]
    });
    service = TestBed.inject(CatService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllBreeds', () => {
    it('should return cat breeds', () => {
      const mockResponse = { success: true, data: [mockBreed] };

      service.getAllBreeds().subscribe(breeds => {
        expect(breeds).toEqual([mockBreed]);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/cats/breeds`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should handle empty response', () => {
      const mockResponse = { success: true, data: null };

      service.getAllBreeds().subscribe(breeds => {
        expect(breeds).toEqual([]);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/cats/breeds`);
      req.flush(mockResponse);
    });
  });

  describe('getBreedById', () => {
    it('should return specific breed', () => {
      const mockResponse = { success: true, data: mockBreed };

      service.getBreedById('1').subscribe(breed => {
        expect(breed).toEqual(mockBreed);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/cats/breeds/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should return null for non-existent breed', () => {
      const mockResponse = { success: false, data: null };

      service.getBreedById('invalid').subscribe(breed => {
        expect(breed).toBeNull();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/cats/breeds/invalid`);
      req.flush(mockResponse);
    });
  });

  describe('searchBreeds', () => {
    it('should search breeds with query', () => {
      const mockResponse = { success: true, data: [mockBreed] };

      service.searchBreeds('Persian').subscribe(breeds => {
        expect(breeds).toEqual([mockBreed]);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/cats/breeds/search?q=Persian`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should search breeds with query and limit', () => {
      const mockResponse = { success: true, data: [mockBreed] };

      service.searchBreeds('Persian', 5).subscribe(breeds => {
        expect(breeds).toEqual([mockBreed]);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/cats/breeds/search?q=Persian&limit=5`);
      req.flush(mockResponse);
    });
  });

  describe('getImagesByBreedId', () => {
    it('should return breed images', () => {
      const mockResponse = { success: true, data: [mockImage] };

      service.getImagesByBreedId('1').subscribe(images => {
        expect(images).toEqual([mockImage]);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/images/imagesbybreedid?breed_id=1&limit=10`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should return breed images with custom limit', () => {
      const mockResponse = { success: true, data: [mockImage] };

      service.getImagesByBreedId('1', 5).subscribe(images => {
        expect(images).toEqual([mockImage]);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/images/imagesbybreedid?breed_id=1&limit=5`);
      req.flush(mockResponse);
    });
  });
});
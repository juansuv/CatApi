import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CatBreed, CatImage } from '../models/cat.models';
import { ApiResponse } from '../models/user.models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CatService {
  private apiUrl = `${environment.apiUrl}/api/cats`;
  private imageUrl = `${environment.apiUrl}/api/images`;

  constructor(private http: HttpClient) {}

  getAllBreeds(): Observable<CatBreed[]> {
    return this.http.get<ApiResponse<CatBreed[]>>(`${this.apiUrl}/breeds`)
      .pipe(map(response => response.data || []));
  }

  getBreedById(breedId: string): Observable<CatBreed | null> {
    return this.http.get<ApiResponse<CatBreed>>(`${this.apiUrl}/breeds/${breedId}`)
      .pipe(map(response => response.data || null));
  }

  searchBreeds(query: string, limit?: number): Observable<CatBreed[]> {
    const params: any = { q: query };
    if (limit) params.limit = limit.toString();
    
    return this.http.get<ApiResponse<CatBreed[]>>(`${this.apiUrl}/breeds/search`, { params })
      .pipe(map(response => response.data || []));
  }

  getImagesByBreedId(breedId: string, limit: number = 10): Observable<CatImage[]> {
    const params = { 
      breed_id: breedId, 
      limit: limit.toString() 
    };
    
    return this.http.get<ApiResponse<CatImage[]>>(`${this.imageUrl}/imagesbybreedid`, { params })
      .pipe(map(response => response.data || []));
  }
}
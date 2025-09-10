import axios, { AxiosResponse } from 'axios';
import { CatBreed, CatImage, BreedSearchParams } from '../types/cat.types';

export interface ICatService {
  getAllBreeds(): Promise<CatBreed[]>;
  getBreedById(breedId: string): Promise<CatBreed | null>;
  searchBreeds(params: BreedSearchParams): Promise<CatBreed[]>;
}

export class CatService implements ICatService {
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(apiKey: string, baseUrl: string) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  async getAllBreeds(): Promise<CatBreed[]> {
    try {
      const response: AxiosResponse<CatBreed[]> = await axios.get(
        `${this.baseUrl}/breeds`,
        {
          headers: {
            'x-api-key': this.apiKey
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching cat breeds:', error);
      throw new Error('Failed to fetch cat breeds');
    }
  }

  async getBreedById(breedId: string): Promise<CatBreed | null> {
    try {
      const response: AxiosResponse<CatBreed> = await axios.get(
        `${this.baseUrl}/breeds/${breedId}`,
        {
          headers: {
            'x-api-key': this.apiKey
          }
        }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      console.error('Error fetching cat breed by ID:', error);
      throw new Error('Failed to fetch cat breed');
    }
  }

  async searchBreeds(params: BreedSearchParams): Promise<CatBreed[]> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.q) queryParams.append('q', params.q);
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.page) queryParams.append('page', params.page.toString());

      const response: AxiosResponse<CatBreed[]> = await axios.get(
        `${this.baseUrl}/breeds/search?${queryParams.toString()}`,
        {
          headers: {
            'x-api-key': this.apiKey
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error searching cat breeds:', error);
      throw new Error('Failed to search cat breeds');
    }
  }
}
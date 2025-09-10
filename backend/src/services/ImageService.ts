import axios, { AxiosResponse } from 'axios';
import { CatImage } from '../types/cat.types';

export interface IImageService {
  getImagesByBreedId(breedId: string, limit?: number): Promise<CatImage[]>;
}

export class ImageService implements IImageService {
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(apiKey: string, baseUrl: string) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  async getImagesByBreedId(breedId: string, limit: number = 10): Promise<CatImage[]> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('breed_ids', breedId);
      queryParams.append('limit', limit.toString());

      const response: AxiosResponse<CatImage[]> = await axios.get(
        `${this.baseUrl}/images/search?${queryParams.toString()}`,
        {
          headers: {
            'x-api-key': this.apiKey
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching images by breed ID:', error);
      throw new Error('Failed to fetch images for the specified breed');
    }
  }
}
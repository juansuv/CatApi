import axios from 'axios';
import { CatService } from '../../services/CatService';
import { CatBreed } from '../../types/cat.types';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('CatService', () => {
  let catService: CatService;
  const mockApiKey = 'test-api-key';
  const mockBaseUrl = 'https://api.example.com';

  beforeEach(() => {
    catService = new CatService(mockApiKey, mockBaseUrl);
    jest.clearAllMocks();
  });

  describe('getAllBreeds', () => {
    it('should return all cat breeds successfully', async () => {
      const mockBreeds: CatBreed[] = [
        {
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
        }
      ];

      mockedAxios.get.mockResolvedValue({ data: mockBreeds });

      const result = await catService.getAllBreeds();

      expect(mockedAxios.get).toHaveBeenCalledWith(
        `${mockBaseUrl}/breeds`,
        {
          headers: {
            'x-api-key': mockApiKey
          }
        }
      );
      expect(result).toEqual(mockBreeds);
    });

    it('should throw error when API call fails', async () => {
      mockedAxios.get.mockRejectedValue(new Error('API Error'));

      await expect(catService.getAllBreeds()).rejects.toThrow('Failed to fetch cat breeds');
    });
  });

  describe('getBreedById', () => {
    it('should return specific breed by ID', async () => {
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

      mockedAxios.get.mockResolvedValue({ data: mockBreed });

      const result = await catService.getBreedById('1');

      expect(mockedAxios.get).toHaveBeenCalledWith(
        `${mockBaseUrl}/breeds/1`,
        {
          headers: {
            'x-api-key': mockApiKey
          }
        }
      );
      expect(result).toEqual(mockBreed);
    });

    it('should return null when breed not found', async () => {
      const mockError = {
        isAxiosError: true,
        response: { status: 404 }
      };
      mockedAxios.isAxiosError.mockReturnValue(true);
      mockedAxios.get.mockRejectedValue(mockError);

      const result = await catService.getBreedById('invalid-id');

      expect(result).toBeNull();
    });
  });

  describe('searchBreeds', () => {
    it('should search breeds with query parameters', async () => {
      const mockBreeds: CatBreed[] = [];
      const searchParams = { q: 'Persian', limit: 5, page: 1 };

      mockedAxios.get.mockResolvedValue({ data: mockBreeds });

      const result = await catService.searchBreeds(searchParams);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        `${mockBaseUrl}/breeds/search?q=Persian&limit=5&page=1`,
        {
          headers: {
            'x-api-key': mockApiKey
          }
        }
      );
      expect(result).toEqual(mockBreeds);
    });

    it('should handle search with minimal parameters', async () => {
      const mockBreeds: CatBreed[] = [];
      const searchParams = { q: 'Persian' };

      mockedAxios.get.mockResolvedValue({ data: mockBreeds });

      await catService.searchBreeds(searchParams);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        `${mockBaseUrl}/breeds/search?q=Persian`,
        expect.any(Object)
      );
    });
  });
});
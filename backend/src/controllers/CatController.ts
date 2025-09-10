import { Request, Response } from 'express';
import { query, validationResult } from 'express-validator';
import { ICatService } from '../services/CatService';

export class CatController {
  private catService: ICatService;

  constructor(catService: ICatService) {
    this.catService = catService;
  }

  public getAllBreeds = async (req: Request, res: Response): Promise<void> => {
    try {
      const breeds = await this.catService.getAllBreeds();
      res.status(200).json({
        success: true,
        data: breeds
      });
    } catch (error) {
      console.error('Error in getAllBreeds:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  };

  public getBreedById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { breed_id } = req.params;
      
      if (!breed_id) {
        res.status(400).json({
          success: false,
          message: 'Breed ID is required'
        });
        return;
      }

      const breed = await this.catService.getBreedById(breed_id);
      
      if (!breed) {
        res.status(404).json({
          success: false,
          message: 'Breed not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: breed
      });
    } catch (error) {
      console.error('Error in getBreedById:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  };

  public searchBreeds = async (req: Request, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array()
        });
        return;
      }

      const { q, limit, page } = req.query;
      
      const searchParams = {
        q: q as string,
        limit: limit ? parseInt(limit as string) : undefined,
        page: page ? parseInt(page as string) : undefined
      };

      const breeds = await this.catService.searchBreeds(searchParams);
      
      res.status(200).json({
        success: true,
        data: breeds
      });
    } catch (error) {
      console.error('Error in searchBreeds:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  };

  public static getSearchValidationRules() {
    return [
      query('q').optional().isString().isLength({ min: 1, max: 100 }),
      query('limit').optional().isInt({ min: 1, max: 100 }),
      query('page').optional().isInt({ min: 0 })
    ];
  }
}
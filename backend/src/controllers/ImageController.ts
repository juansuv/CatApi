import { Request, Response } from 'express';
import { query, validationResult } from 'express-validator';
import { IImageService } from '../services/ImageService';

export class ImageController {
  private imageService: IImageService;

  constructor(imageService: IImageService) {
    this.imageService = imageService;
  }

  public getImagesByBreedId = async (req: Request, res: Response): Promise<void> => {
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

      const { breed_id, limit } = req.query;

      if (!breed_id) {
        res.status(400).json({
          success: false,
          message: 'breed_id is required'
        });
        return;
      }

      const imageLimit = limit ? parseInt(limit as string) : 10;
      const images = await this.imageService.getImagesByBreedId(breed_id as string, imageLimit);
      
      res.status(200).json({
        success: true,
        data: images
      });
    } catch (error) {
      console.error('Error in getImagesByBreedId:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  };

  public static getImagesByBreedIdValidationRules() {
    return [
      query('breed_id').notEmpty().isString().isLength({ min: 1, max: 50 }),
      query('limit').optional().isInt({ min: 1, max: 50 })
    ];
  }
}
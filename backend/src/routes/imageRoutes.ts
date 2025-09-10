import { Router } from 'express';
import { ImageController } from '../controllers/ImageController';
import { IImageService } from '../services/ImageService';

export const createImageRoutes = (imageService: IImageService): Router => {
  const router = Router();
  const imageController = new ImageController(imageService);

  router.get('/imagesbybreedid', ImageController.getImagesByBreedIdValidationRules(), imageController.getImagesByBreedId);

  return router;
};
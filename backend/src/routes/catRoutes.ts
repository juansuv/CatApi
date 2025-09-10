import { Router } from 'express';
import { CatController } from '../controllers/CatController';
import { ICatService } from '../services/CatService';

export const createCatRoutes = (catService: ICatService): Router => {
  const router = Router();
  const catController = new CatController(catService);

  router.get('/breeds', catController.getAllBreeds);
  router.get('/breeds/search', CatController.getSearchValidationRules(), catController.searchBreeds);
  router.get('/breeds/:breed_id', catController.getBreedById);

  return router;
};
import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { IUserService, UserService } from '../services/UserService';
import { authMiddleware } from '../middlewares/auth';

export const createUserRoutes = (userService: IUserService): Router => {
  const router = Router();
  const userController = new UserController(userService);

  router.post('/login', UserController.getLoginValidationRules(), userController.login);
  router.post('/register', UserController.getRegisterValidationRules(), userController.register);
  router.get('/profile', authMiddleware(userService as UserService), userController.getProfile);

  return router;
};
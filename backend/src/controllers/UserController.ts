import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { IUserService } from '../services/UserService';

export class UserController {
  private userService: IUserService;

  constructor(userService: IUserService) {
    this.userService = userService;
  }

  public login = async (req: Request, res: Response): Promise<void> => {
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

      const { username, password } = req.body;
      const result = await this.userService.login({ username, password });

      if (!result) {
        res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Error in login:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  };

  public register = async (req: Request, res: Response): Promise<void> => {
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

      const { username, email, password, firstName, lastName } = req.body;
      
      const result = await this.userService.register({
        username,
        email,
        password,
        firstName,
        lastName
      });

      res.status(201).json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Error in register:', error);
      
      if (error instanceof Error && error.message === 'Username or email already exists') {
        res.status(409).json({
          success: false,
          message: error.message
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  };

  public getProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).userId;
      const user = await this.userService.getUserById(userId);

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      console.error('Error in getProfile:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  };

  public static getLoginValidationRules() {
    return [
      body('username').notEmpty().isString().isLength({ min: 3, max: 30 }),
      body('password').notEmpty().isString().isLength({ min: 6, max: 100 })
    ];
  }

  public static getRegisterValidationRules() {
    return [
      body('username').notEmpty().isString().isLength({ min: 3, max: 30 }),
      body('email').isEmail().normalizeEmail(),
      body('password').notEmpty().isString().isLength({ min: 6, max: 100 }),
      body('firstName').notEmpty().isString().isLength({ min: 1, max: 50 }),
      body('lastName').notEmpty().isString().isLength({ min: 1, max: 50 })
    ];
  }
}
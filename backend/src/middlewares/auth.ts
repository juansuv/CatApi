import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/UserService';

export interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const authMiddleware = (userService: UserService) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    try {
      const authHeader = req.header('Authorization');
      
      if (!authHeader) {
        res.status(401).json({
          success: false,
          message: 'Access denied. No token provided.'
        });
        return;
      }

      const token = authHeader.startsWith('Bearer ') 
        ? authHeader.substring(7)
        : authHeader;

      const decoded = userService.verifyToken(token);
      
      if (!decoded) {
        res.status(401).json({
          success: false,
          message: 'Access denied. Invalid token.'
        });
        return;
      }

      req.userId = decoded.userId;
      next();
    } catch (error) {
      console.error('Auth middleware error:', error);
      res.status(401).json({
        success: false,
        message: 'Access denied. Invalid token.'
      });
    }
  };
};
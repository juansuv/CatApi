import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel, UserDocument } from '../models/User';
import { UserRegistrationData, UserLoginData, UserResponse, AuthResponse } from '../types/user.types';

export interface IUserService {
  register(userData: UserRegistrationData): Promise<AuthResponse>;
  login(loginData: UserLoginData): Promise<AuthResponse | null>;
  getUserById(userId: string): Promise<UserResponse | null>;
}

export class UserService implements IUserService {
  private readonly jwtSecret: string;

  constructor(jwtSecret: string) {
    this.jwtSecret = jwtSecret;
  }

  async register(userData: UserRegistrationData): Promise<AuthResponse> {
    try {
      const existingUser = await UserModel.findOne({
        $or: [
          { username: userData.username },
          { email: userData.email }
        ]
      });

      if (existingUser) {
        throw new Error('Username or email already exists');
      }

      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

      const newUser = new UserModel({
        ...userData,
        password: hashedPassword
      });

      const savedUser = await newUser.save();
      const userResponse = this.mapToUserResponse(savedUser);
      const token = this.generateToken(savedUser._id);

      return {
        user: userResponse,
        token
      };
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  }

  async login(loginData: UserLoginData): Promise<AuthResponse | null> {
    try {
      const user = await UserModel.findOne({ username: loginData.username });

      if (!user) {
        return null;
      }

      const isPasswordValid = await bcrypt.compare(loginData.password, user.password);

      if (!isPasswordValid) {
        return null;
      }

      const userResponse = this.mapToUserResponse(user);
      const token = this.generateToken(user._id);

      return {
        user: userResponse,
        token
      };
    } catch (error) {
      console.error('Error during login:', error);
      throw new Error('Login failed');
    }
  }

  async getUserById(userId: string): Promise<UserResponse | null> {
    try {
      const user = await UserModel.findById(userId);
      
      if (!user) {
        return null;
      }

      return this.mapToUserResponse(user);
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      throw new Error('Failed to fetch user');
    }
  }

  private mapToUserResponse(user: UserDocument): UserResponse {
    return {
      _id: user._id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      createdAt: user.createdAt!,
      updatedAt: user.updatedAt!
    };
  }

  private generateToken(userId: string): string {
    return jwt.sign({ userId }, this.jwtSecret, { expiresIn: '24h' });
  }

  public verifyToken(token: string): { userId: string } | null {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as { userId: string };
      return decoded;
    } catch (error) {
      return null;
    }
  }
}
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserService } from '../../services/UserService';
import { UserModel } from '../../models/User';

jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('../../models/User');

const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;
const mockedJwt = jwt as jest.Mocked<typeof jwt>;
const mockedUserModel = UserModel as jest.MockedClass<typeof UserModel>;

describe('UserService', () => {
  let userService: UserService;
  const mockJwtSecret = 'test-jwt-secret';

  beforeEach(() => {
    userService = new UserService(mockJwtSecret);
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User'
      };

      const mockUser = {
        _id: 'user123',
        ...userData,
        password: 'hashedpassword',
        createdAt: new Date(),
        updatedAt: new Date(),
        save: jest.fn().mockResolvedValue({
          _id: 'user123',
          ...userData,
          password: 'hashedpassword',
          createdAt: new Date(),
          updatedAt: new Date()
        })
      };

      mockedUserModel.findOne.mockResolvedValue(null);
      mockedBcrypt.hash.mockResolvedValue('hashedpassword' as never);
      mockedUserModel.mockImplementation(() => mockUser as any);
      mockedJwt.sign.mockReturnValue('fake-jwt-token' as never);

      const result = await userService.register(userData);

      expect(mockedUserModel.findOne).toHaveBeenCalledWith({
        $or: [
          { username: userData.username },
          { email: userData.email }
        ]
      });
      expect(mockedBcrypt.hash).toHaveBeenCalledWith(userData.password, 12);
      expect(result.user.username).toBe(userData.username);
      expect(result.token).toBe('fake-jwt-token');
    });

    it('should throw error if username or email already exists', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User'
      };

      const existingUser = { _id: 'existing-user' };
      mockedUserModel.findOne.mockResolvedValue(existingUser as any);

      await expect(userService.register(userData)).rejects.toThrow('Username or email already exists');
    });
  });

  describe('login', () => {
    it('should login user successfully with valid credentials', async () => {
      const loginData = {
        username: 'testuser',
        password: 'password123'
      };

      const mockUser = {
        _id: 'user123',
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedpassword',
        firstName: 'Test',
        lastName: 'User',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockedUserModel.findOne.mockResolvedValue(mockUser as any);
      mockedBcrypt.compare.mockResolvedValue(true as never);
      mockedJwt.sign.mockReturnValue('fake-jwt-token' as never);

      const result = await userService.login(loginData);

      expect(mockedUserModel.findOne).toHaveBeenCalledWith({ username: loginData.username });
      expect(mockedBcrypt.compare).toHaveBeenCalledWith(loginData.password, mockUser.password);
      expect(result?.user.username).toBe(loginData.username);
      expect(result?.token).toBe('fake-jwt-token');
    });

    it('should return null for invalid username', async () => {
      const loginData = {
        username: 'nonexistent',
        password: 'password123'
      };

      mockedUserModel.findOne.mockResolvedValue(null);

      const result = await userService.login(loginData);

      expect(result).toBeNull();
    });

    it('should return null for invalid password', async () => {
      const loginData = {
        username: 'testuser',
        password: 'wrongpassword'
      };

      const mockUser = {
        _id: 'user123',
        username: 'testuser',
        password: 'hashedpassword'
      };

      mockedUserModel.findOne.mockResolvedValue(mockUser as any);
      mockedBcrypt.compare.mockResolvedValue(false as never);

      const result = await userService.login(loginData);

      expect(result).toBeNull();
    });
  });

  describe('verifyToken', () => {
    it('should verify valid token successfully', () => {
      const mockDecoded = { userId: 'user123' };
      mockedJwt.verify.mockReturnValue(mockDecoded as never);

      const result = userService.verifyToken('valid-token');

      expect(mockedJwt.verify).toHaveBeenCalledWith('valid-token', mockJwtSecret);
      expect(result).toEqual(mockDecoded);
    });

    it('should return null for invalid token', () => {
      mockedJwt.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      const result = userService.verifyToken('invalid-token');

      expect(result).toBeNull();
    });
  });
});
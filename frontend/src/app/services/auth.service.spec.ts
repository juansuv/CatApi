import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { User, UserLogin, UserRegistration, AuthResponse } from '../models/user.models';
import { environment } from '../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  const mockUser: User = {
    _id: 'user123',
    username: 'testuser',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const mockAuthResponse: AuthResponse = {
    user: mockUser,
    token: 'fake-jwt-token'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    
    // Clear localStorage
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should login user successfully', () => {
      const loginData: UserLogin = {
        username: 'testuser',
        password: 'password123'
      };
      const mockResponse = { success: true, data: mockAuthResponse };

      service.login(loginData).subscribe(response => {
        expect(response).toEqual(mockAuthResponse);
        expect(localStorage.getItem('token')).toBe('fake-jwt-token');
        expect(localStorage.getItem('user')).toBe(JSON.stringify(mockUser));
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/users/login`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(loginData);
      req.flush(mockResponse);
    });
  });

  describe('register', () => {
    it('should register user successfully', () => {
      const registrationData: UserRegistration = {
        username: 'newuser',
        email: 'new@example.com',
        password: 'password123',
        firstName: 'New',
        lastName: 'User'
      };
      const mockResponse = { success: true, data: mockAuthResponse };

      service.register(registrationData).subscribe(response => {
        expect(response).toEqual(mockAuthResponse);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/users/register`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(registrationData);
      req.flush(mockResponse);
    });
  });

  describe('logout', () => {
    it('should clear localStorage and user state', () => {
      localStorage.setItem('token', 'fake-token');
      localStorage.setItem('user', JSON.stringify(mockUser));

      service.logout();

      expect(localStorage.getItem('token')).toBeNull();
      expect(localStorage.getItem('user')).toBeNull();
      expect(service.getCurrentUser()).toBeNull();
    });
  });

  describe('getProfile', () => {
    it('should get user profile', () => {
      const mockResponse = { success: true, data: mockUser };

      service.getProfile().subscribe(user => {
        expect(user).toEqual(mockUser);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/users/profile`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('isAuthenticated', () => {
    it('should return false when no token exists', () => {
      expect(service.isAuthenticated()).toBeFalsy();
    });

    it('should return true when token and user exist', () => {
      localStorage.setItem('token', 'fake-token');
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      // Recreate service to load stored user
      service = new AuthService(TestBed.inject(HttpClientTestingModule) as any);
      
      expect(service.isAuthenticated()).toBeTruthy();
    });
  });

  describe('getToken', () => {
    it('should return null when no token exists', () => {
      expect(service.getToken()).toBeNull();
    });

    it('should return token when exists', () => {
      localStorage.setItem('token', 'fake-token');
      expect(service.getToken()).toBe('fake-token');
    });
  });
});
export interface User {
  _id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserRegistration {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface UserLogin {
  username: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: any[];
}
export interface User {
  _id?: string;
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserRegistrationData {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface UserLoginData {
  username: string;
  password: string;
}

export interface UserResponse {
  _id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthResponse {
  user: UserResponse;
  token: string;
}
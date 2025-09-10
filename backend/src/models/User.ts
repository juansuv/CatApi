import mongoose, { Schema, Document } from 'mongoose';
import { User } from '../types/user.types';

export interface UserDocument extends User, Document {
  _id: string;
}

const userSchema = new Schema<UserDocument>({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  }
}, {
  timestamps: true
});

userSchema.index({ username: 1 });
userSchema.index({ email: 1 });

export const UserModel = mongoose.model<UserDocument>('User', userSchema);
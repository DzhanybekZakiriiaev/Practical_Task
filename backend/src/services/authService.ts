import { User } from '../models/User';
import { mockStorage } from '../database/mockStorage';
import { v4 as uuidv4 } from 'uuid';

export interface IAuthService {
  login(email: string, password: string): Promise<{ user: User; token: string }>;
  register(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User>;
}

export class AuthService implements IAuthService {
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const user = await mockStorage.getUserByEmail(email);
    if (!user || user.password !== password) {
      throw new Error('Invalid credentials');
    }
    // Generate token and store it
    const token = uuidv4();
    await mockStorage.saveToken(user.id, token);
    return { user, token };
  }

  async register(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const existingUser = await mockStorage.getUserByEmail(userData.email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    const user: User = {
      ...userData,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return await mockStorage.saveUser(user);
  }
} 
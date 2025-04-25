import { User, UserRole } from '../models/User';
import { mockStorage } from '../database/mockStorage';

export interface IUserService {
  getUserById(id: string): Promise<User | null>;
  updateUser(id: string, userData: Partial<User>): Promise<User>;
  deleteUser(id: string): Promise<boolean>;
  changeUserRole(id: string, role: UserRole): Promise<User>;
}

export class UserService implements IUserService {
  async getUserById(id: string): Promise<User | null> {
    return await mockStorage.getUser(id);
  }

  async updateUser(id: string, userData: Partial<User>): Promise<User> {
    const user = await mockStorage.getUser(id);
    if (!user) {
      throw new Error('User not found');
    }

    const updatedUser: User = {
      ...user,
      ...userData,
      updatedAt: new Date()
    };

    return await mockStorage.saveUser(updatedUser);
  }

  async deleteUser(id: string): Promise<boolean> {
    const user = await mockStorage.getUser(id);
    if (!user) {
      throw new Error('User not found');
    }

    return await mockStorage.deleteUser(id);
  }

  async changeUserRole(id: string, role: UserRole): Promise<User> {
    return await this.updateUser(id, { role });
  }
} 
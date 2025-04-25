import { Request, Response } from 'express';
import { UserService, IUserService } from '../services/userService';

interface AuthenticatedRequest extends Request {
  user?: any;
}

export class UserController {
  private userService: IUserService;

  constructor(userService: IUserService = new UserService()) {
    this.userService = userService;
  }

  async getCurrentUser(req: AuthenticatedRequest, res: Response) {
    try {
      // The user object is already attached to the request by the auth middleware
      res.json(req.user);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch user profile' });
    }
  }

  async getUserById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await this.userService.getUserById(id);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Don't send sensitive information
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch user details' });
    }
  }

  async updateCurrentUser(req: AuthenticatedRequest, res: Response) {
    try {
      const updatedUser = await this.userService.updateUser(req.user.id, req.body);
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update user profile' });
    }
  }

  async deleteCurrentUser(req: AuthenticatedRequest, res: Response) {
    try {
      await this.userService.deleteUser(req.user.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete user profile' });
    }
  }

  async changeCurrentUserRole(req: AuthenticatedRequest, res: Response) {
    try {
      const updatedUser = await this.userService.changeUserRole(req.user.id, req.body.role);
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ error: 'Failed to change user role' });
    }
  }
} 
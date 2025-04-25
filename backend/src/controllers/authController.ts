import { Request, Response } from 'express';
import { AuthService, IAuthService } from '../services/authService';

export class AuthController {
  private authService: IAuthService;

  constructor(authService: IAuthService = new AuthService()) {
    this.authService = authService;
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const result = await this.authService.login(email, password);
      res.json(result);
    } catch (error) {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  }

  async register(req: Request, res: Response) {
    try {
      const user = await this.authService.register(req.body);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ error: 'Registration failed' });
    }
  }
} 
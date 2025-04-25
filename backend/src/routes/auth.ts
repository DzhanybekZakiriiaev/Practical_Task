import express from 'express';
import { AuthController } from '../controllers/authController';

const router = express.Router();
const authController = new AuthController();

// Login route
router.post('/login', (req, res) => {
  authController.login(req, res);
});

// Register route
router.post('/register', (req, res) => {
  authController.register(req, res);
});

export default router; 
import express from 'express';
import { UserController } from '../controllers/userController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();
const userController = new UserController();

// Get current user profile
router.get('/profile', authenticateToken, (req, res) => {
    userController.getCurrentUser(req, res);
});

// Get user by ID
router.get('/:id', authenticateToken, (req, res) => {
    userController.getUserById(req, res);
});

// Update current user
router.put('/profile', authenticateToken, (req, res) => {
    userController.updateCurrentUser(req, res);
});

// Delete current user
router.delete('/profile', authenticateToken, (req, res) => {
    userController.deleteCurrentUser(req, res);
});

// Change current user role (if authorized)
router.put('/profile/role', authenticateToken, (req, res) => {
    userController.changeCurrentUserRole(req, res);
});

export default router; 
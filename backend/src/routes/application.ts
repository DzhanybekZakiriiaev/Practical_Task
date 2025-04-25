import express from 'express';
import { ApplicationController } from '../controllers/applicationController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();
const applicationController = new ApplicationController();

// Get all applications
router.get('/', authenticateToken, (req, res) => {
    applicationController.getAllApplications(req, res);
});

// Get application by ID
router.get('/:id', authenticateToken, (req, res) => {
    applicationController.getApplication(req, res);
});

// Create and evaluate new application
router.post('/evaluate', authenticateToken, (req, res) => {
    applicationController.createAndEvaluateApplication(req, res);
});

// Create new application (legacy route)
router.post('/', authenticateToken, (req, res) => {
    applicationController.createApplication(req, res);
});

// Update application
router.put('/:id', authenticateToken, (req, res) => {
    applicationController.updateApplication(req, res);
});

export default router; 
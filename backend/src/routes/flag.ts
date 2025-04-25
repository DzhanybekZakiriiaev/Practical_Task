import express from 'express';
import { FlagController } from '../controllers/flagController';
import { FlagType } from '../models/Application';

const router = express.Router();
const flagController = new FlagController();

// Get all flag types
router.get('/types', (req, res) => {
  res.json(Object.values(FlagType));
});

router.get('/application/:applicationId', flagController.getFlagsByApplication.bind(flagController));
router.post('/:flagId/override', flagController.overrideFlag.bind(flagController));

export default router; 
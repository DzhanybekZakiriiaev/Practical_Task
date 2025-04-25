import { Request, Response } from 'express';
import { FlagService } from '../services/flagService';
import { mockStorage } from '../database/mockStorage';

const flagService = new FlagService();

export class FlagController {
  async getFlagsByApplication(req: Request, res: Response) {
    try {
      const { applicationId } = req.params;
      const flags = await mockStorage.getFlagsByApplicationId(applicationId);
      res.json(flags);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch flags' });
    }
  }

  async overrideFlag(req: Request, res: Response) {
    try {
      const { flagId } = req.params;
      const { userId, overrideReason } = req.body;

      if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
      }

      if (!overrideReason) {
        return res.status(400).json({ error: 'Override reason is required' });
      }

      const updatedFlag = await flagService.overrideFlag(flagId, userId, overrideReason);
      res.json(updatedFlag);
    } catch (error) {
      console.error('Error overriding flag:', error);
      res.status(500).json({ error: 'Failed to override flag' });
    }
  }
} 
import { Request, Response } from 'express';
import { ApplicationService, IApplicationService } from '../services/applicationService';
import { FlagService, IFlagService } from '../services/flagService';

interface ApplicationError extends Error {
  message: string;
}

export class ApplicationController {
  private applicationService: IApplicationService;
  private flagService: IFlagService;

  constructor() {
    this.applicationService = new ApplicationService();
    this.flagService = new FlagService();
  }

  async getAllApplications(req: Request, res: Response) {
    console.log('Backend: Received request to get all applications');
    try {
      // Get user info from request (added by auth middleware)
      const user = (req as any).user;
      console.log('Backend: User requesting applications:', user);

      let applications;
      if (user.role === 'REVIEWER') {
        // Reviewers can see all applications
        applications = await this.applicationService.getAllApplications();
        console.log('Backend: Returning all applications for reviewer');
      } else {
        // Applicants can only see their own applications
        applications = await this.applicationService.getApplicationsByUserId(user.id);
        console.log('Backend: Returning user-specific applications for applicant');
      }

      console.log('Backend: Successfully retrieved applications:', applications);
      res.json(applications);
    } catch (error) {
      console.error('Backend: Error retrieving applications:', error);
      res.status(500).json({ error: 'Failed to retrieve applications' });
    }
  }

  async getApplication(req: Request, res: Response) {
    const { id } = req.params;
    console.log('Backend: Received request to get application with ID:', id);
    try {
      const application = await this.applicationService.getApplication(id);
      
      if (!application) {
        console.log('Backend: Application not found with ID:', id);
        return res.status(404).json({ error: 'Application not found' });
      }

      const flags = await this.flagService.evaluateApplication(application);
      console.log('Backend: Successfully retrieved application:', application);
      res.json({ application, flags });
    } catch (error) {
      console.error('Backend: Error retrieving application:', error);
      res.status(500).json({ error: 'Failed to retrieve application' });
    }
  }

  async createApplication(req: Request, res: Response) {
    console.log('Backend: Received request to create application');
    console.log('Backend: Application data:', req.body);
    try {
      // Get user info from request (added by auth middleware)
      const user = (req as any).user;
      
      // Add userId and default status to the application data
      const applicationData = {
        ...req.body,
        userId: user.id,
        status: 'PENDING'
      };
      
      const application = await this.applicationService.createApplication(applicationData);
      const flags = await this.flagService.evaluateApplication(application);
      
      console.log('Backend: Successfully created application:', application);
      res.status(201).json({ application, flags });
    } catch (error) {
      console.error('Backend: Error creating application:', error);
      res.status(500).json({ error: 'Failed to create application' });
    }
  }

  async updateApplication(req: Request, res: Response) {
    const { id } = req.params;
    console.log('Backend: Received request to update application with ID:', id);
    console.log('Backend: Update data:', req.body);
    try {
      // If status is being updated, ensure it's uppercase
      const updateData = { ...req.body };
      if (updateData.status) {
        updateData.status = updateData.status.toUpperCase();
      }
      
      const application = await this.applicationService.updateApplication(id, updateData);
      const flags = await this.flagService.evaluateApplication(application);
      
      console.log('Backend: Successfully updated application:', application);
      res.json({ application, flags });
    } catch (error) {
      console.error('Backend: Error updating application:', error);
      res.status(500).json({ error: 'Failed to update application' });
    }
  }

  async deleteApplication(req: Request, res: Response) {
    const { id } = req.params;
    console.log('Backend: Received request to delete application with ID:', id);
    try {
      await this.applicationService.deleteApplication(id);
      console.log('Backend: Successfully deleted application with ID:', id);
      res.status(204).send();
    } catch (error) {
      console.error('Backend: Error deleting application:', error);
      if (error instanceof Error && error.message === 'Application not found') {
        res.status(404).json({ error: 'Application not found' });
      } else {
        res.status(500).json({ error: 'Failed to delete application' });
      }
    }
  }
} 
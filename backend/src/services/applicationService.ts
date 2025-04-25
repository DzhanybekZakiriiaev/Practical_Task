import { Application } from '../models/Application';
import { MockStorage } from '../database/mockStorage';

export interface IApplicationService {
  createApplication(data: Partial<Application>): Promise<Application>;
  getApplication(id: string): Promise<Application | null>;
  getAllApplications(): Promise<Application[]>;
  getApplicationsByUserId(userId: string): Promise<Application[]>;
  updateApplication(id: string, data: Partial<Application>): Promise<Application>;
  deleteApplication(id: string): Promise<void>;
}

export class ApplicationService implements IApplicationService {
  private mockStorage: MockStorage;

  constructor() {
    this.mockStorage = new MockStorage();
  }

  async createApplication(data: Partial<Application>): Promise<Application> {
    const application: Application = {
      id: Math.random().toString(36).substr(2, 9),
      status: 'PENDING',
      createdAt: new Date(),
      updatedAt: new Date(),
      ...data
    } as Application;

    return await this.mockStorage.saveApplication(application);
  }

  async getApplication(id: string): Promise<Application | null> {
    return await this.mockStorage.getApplication(id);
  }

  async getAllApplications(): Promise<Application[]> {
    return await this.mockStorage.getAllApplications();
  }

  async getApplicationsByUserId(userId: string): Promise<Application[]> {
    return await this.mockStorage.getApplicationsByUserId(userId);
  }

  async updateApplication(id: string, data: Partial<Application>): Promise<Application> {
    const existingApplication = await this.mockStorage.getApplication(id);
    if (!existingApplication) {
      throw new Error('Application not found');
    }

    const updatedApplication: Application = {
      ...existingApplication,
      ...data,
      updatedAt: new Date()
    };

    return await this.mockStorage.saveApplication(updatedApplication);
  }

  async deleteApplication(id: string): Promise<void> {
    const success = await this.mockStorage.deleteApplication(id);
    if (!success) {
      throw new Error('Application not found');
    }
  }
} 
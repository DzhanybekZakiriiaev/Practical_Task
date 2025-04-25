import { Application } from '../models/Application';
import { User } from '../models/User';
import { Flag } from '../models/Flag';
import * as fs from 'fs';
import * as path from 'path';

interface MockData {
  applications: Application[];
  users: User[];
  flags: Flag[];
}

export class MockStorage {
  private applications: Application[] = [];
  private users: User[] = [];
  private flags: Flag[] = [];
  private tokens: Map<string, string> = new Map(); // Map<token, userId>

  constructor() {
    this.loadMockData();
  }

  private loadMockData() {
    try {
      const mockDataPath = path.join(__dirname, 'mockData.json');
      const rawData = fs.readFileSync(mockDataPath, 'utf8');
      const mockData: MockData = JSON.parse(rawData);
      
      this.applications = mockData.applications || [];
      this.users = mockData.users || [];
      this.flags = mockData.flags || [];
      
      console.log('Mock DB: Data loaded successfully');
      console.log(`Loaded ${this.applications.length} applications`);
      console.log(`Loaded ${this.users.length} users`);
      console.log(`Loaded ${this.flags.length} flags`);
    } catch (error) {
      console.error('Mock DB: Error loading mock data:', error);
    }
  }

  // Application methods
  async getAllApplications(): Promise<Application[]> {
    console.log('Mock DB: Retrieving all applications');
    return Array.from(this.applications);
  }

  async getApplicationsByUserId(userId: string): Promise<Application[]> {
    console.log('Mock DB: Filtering applications for user ID:', userId);
    const applications = this.applications.filter(app => app.userId === userId);
    console.log('Mock DB: Found applications:', applications);
    return applications;
  }

  async getApplication(id: string): Promise<Application | null> {
    console.log('Mock DB: Retrieving application with ID:', id);
    const application = this.applications.find(app => app.id === id);
    console.log('Mock DB: Found application:', application);
    return application || null;
  }

  async saveApplication(application: Application): Promise<Application> {
    console.log('Mock DB: Saving application:', application);
    const index = this.applications.findIndex(app => app.id === application.id);
    if (index !== -1) {
      this.applications[index] = application;
    } else {
      this.applications.push(application);
    }
    return application;
  }

  async deleteApplication(id: string): Promise<boolean> {
    console.log('Mock DB: Attempting to delete application with ID:', id);
    const index = this.applications.findIndex(app => app.id === id);
    if (index === -1) {
      console.log('Mock DB: Application not found with ID:', id);
      return false;
    }
    this.applications.splice(index, 1);
    console.log('Mock DB: Successfully deleted application with ID:', id);
    return true;
  }

  // User methods
  async getUser(id: string): Promise<User | null> {
    return this.users.find(u => u.id === id) || null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.users.find(u => u.email === email) || null;
  }

  async saveUser(user: User): Promise<User> {
    const index = this.users.findIndex(u => u.id === user.id);
    if (index !== -1) {
      this.users[index] = user;
    } else {
      this.users.push(user);
    }
    return user;
  }

  async deleteUser(id: string): Promise<boolean> {
    const index = this.users.findIndex(u => u.id === id);
    if (index !== -1) {
      this.users.splice(index, 1);
      return true;
    }
    return false;
  }

  // Flag methods
  async getFlagsByApplicationId(applicationId: string): Promise<Flag[]> {
    return this.flags.filter(f => f.applicationId === applicationId);
  }

  async getFlag(id: string): Promise<Flag | null> {
    return this.flags.find(f => f.id === id) || null;
  }

  async saveFlag(flag: Flag): Promise<Flag> {
    const index = this.flags.findIndex(f => f.id === flag.id);
    if (index !== -1) {
      this.flags[index] = flag;
    } else {
      this.flags.push(flag);
    }
    return flag;
  }

  // Token methods
  async saveToken(userId: string, token: string): Promise<void> {
    this.tokens.set(token, userId);
  }

  async getUserByToken(token: string): Promise<User | null> {
    const userId = this.tokens.get(token);
    if (!userId) return null;
    return this.getUser(userId);
  }

  async removeToken(token: string): Promise<void> {
    this.tokens.delete(token);
  }
}

export const mockStorage = new MockStorage(); 
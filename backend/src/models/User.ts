export interface User {
  id: string;
  email: string;
  password: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  REVIEWER = 'REVIEWER',
  APPLICANT = 'APPLICANT'
} 
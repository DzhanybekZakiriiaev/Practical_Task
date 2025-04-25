export enum FlagType {
  CITIZENSHIP = 'CITIZENSHIP',
  DRIVERS_LICENSE = 'DRIVERS_LICENSE',
  CRIMINAL_HISTORY = 'CRIMINAL_HISTORY',
  EMPLOYMENT_GAPS = 'EMPLOYMENT_GAPS',
  EDUCATION_VERIFICATION = 'EDUCATION_VERIFICATION',
  REFERENCE_CHECK = 'REFERENCE_CHECK',
  SOCIAL_MEDIA_PRESENCE = 'SOCIAL_MEDIA_PRESENCE',
  SKILLS_ASSESSMENT = 'SKILLS_ASSESSMENT',
  LANGUAGE_PROFICIENCY = 'LANGUAGE_PROFICIENCY',
  WORK_AUTHORIZATION = 'WORK_AUTHORIZATION'
}

export enum FlagSeverity {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low'
}

export interface Flag {
  id: string;
  applicationId: string;
  type: FlagType;
  severity: FlagSeverity;
  message: string;
  isOverridden: boolean;
  overriddenBy?: string;
  overriddenAt: Date | null;
  overrideReason?: string;
  createdAt: Date;
} 
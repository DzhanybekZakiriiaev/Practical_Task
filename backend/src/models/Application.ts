export enum ApplicationStatus {
  PENDING = 'PENDING',
  IN_REVIEW = 'IN_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  WITHDRAWN = 'WITHDRAWN'
}

export interface Application {
  id: string;
  userId: string;
  status: ApplicationStatus;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  citizenship?: 'PR' | 'Citizen' | 'Other';
  driversLicense?: boolean;
  driversLicenseType?: 'Canadian' | 'International';
  hasCriminalHistory?: boolean;
  hasEmploymentGaps?: boolean;
  educationVerified?: boolean;
  referencesChecked?: boolean;
  socialMediaChecked?: boolean;
  skillsAssessed?: boolean;
  languageProficiencyVerified?: boolean;
  workAuthorizationVerified?: boolean;

  dob?: Date;
  medicalSchool?: string;
  medDegreeProgram?: string;
  yearGraduation?: number;
  languageOfEducation?: string;
  postGradCompleted?: boolean;
  rotationsCompleted?: boolean;
  monthsPostGradTraining?: number;
  monthsIndependentPractice?: number;
  canadianPracticeCriteriaMet?: boolean;
  
  // English proficiency
  englishExam?: 'IELTS' | 'TOEFL' | 'Other';
  englishExamScore?: number;
  englishProficiencyExpired?: boolean;
  activeUseOfEnglish?: boolean;
  
  // TDM specific
  tdmWritten?: boolean;
  tdmResult?: 'Pass' | 'Fail' | 'Pending';
  
  // Other jurisdiction
  otherJurisdictionParticipation?: boolean;
  
  // Exam dates
  nacDate?: Date;
  mccqe1Date?: Date;
  mccqe2Date?: Date;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

export interface Flag {
  id: string;
  applicationId: string;
  type: FlagType;
  message: string;
  isOverridden: boolean;
  overriddenBy?: string;
  overriddenAt?: Date;
  createdAt: Date;
}

export enum FlagType {
  CITIZENSHIP = 'CITIZENSHIP',
  DRIVERS_LICENSE = 'DRIVERS_LICENSE',
  INTERNATIONAL_LICENSE = 'INTERNATIONAL_LICENSE',
  PRACTICE_HOURS = 'PRACTICE_HOURS',
  ENGLISH_PROFICIENCY = 'ENGLISH_PROFICIENCY',
  EXAMINATIONS = 'EXAMINATIONS',
  POSTGRAD_TRAINING = 'POSTGRAD_TRAINING',
  ROTATIONS = 'ROTATIONS',
  MEDICAL_EDUCATION = 'MEDICAL_EDUCATION'
} 
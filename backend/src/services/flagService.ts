import { Application } from '../models/Application';
import { Flag, FlagType, FlagSeverity } from '../models/Flag';
import { mockStorage } from '../database/mockStorage';

export interface IFlagService {
  evaluateApplication(application: Application): Promise<Flag[]>;
  overrideFlag(flagId: string, userId: string, overrideReason: string): Promise<Flag>;
}

export interface IFlagRule {
  evaluate(application: Application): Flag | null;
}

export class FlagService implements IFlagService {
  private rules: IFlagRule[];

  constructor() {
    this.rules = [
      new CitizenshipRule(),
      new DriversLicenseRule(),
      new CriminalHistoryRule(),
      new EmploymentGapsRule(),
      new EducationVerificationRule(),
      new ReferenceCheckRule(),
      new SocialMediaPresenceRule(),
      new SkillsAssessmentRule(),
      new LanguageProficiencyRule(),
      new WorkAuthorizationRule()
    ];
  }

  async evaluateApplication(application: Application): Promise<Flag[]> {
    const flags: Flag[] = [];
    
    for (const rule of this.rules) {
      const flag = rule.evaluate(application);
      if (flag) {
        flags.push(flag);
        await mockStorage.saveFlag(flag);
      }
    }

    return flags;
  }

  async overrideFlag(flagId: string, userId: string, overrideReason: string): Promise<Flag> {
    const flag = await mockStorage.getFlag(flagId);
    if (!flag) {
      throw new Error('Flag not found');
    }

    const updatedFlag: Flag = {
      ...flag,
      isOverridden: true,
      overriddenBy: userId,
      overriddenAt: new Date(),
      overrideReason: overrideReason
    };

    return await mockStorage.saveFlag(updatedFlag);
  }
}

// Flag Rules
class CitizenshipRule implements IFlagRule {
  evaluate(application: Application): Flag | null {
    if (!application.citizenship) {
      return {
        id: crypto.randomUUID(),
        applicationId: application.id,
        type: FlagType.CITIZENSHIP,
        severity: FlagSeverity.HIGH,
        message: 'Citizenship status not provided',
        isOverridden: false,
        createdAt: new Date(),
        overriddenAt: null
      };
    }
    return null;
  }
}

class DriversLicenseRule implements IFlagRule {
  evaluate(application: Application): Flag | null {
    if (!application.driversLicense) {
      return {
        id: crypto.randomUUID(),
        applicationId: application.id,
        type: FlagType.DRIVERS_LICENSE,
        severity: FlagSeverity.MEDIUM,
        message: 'Driver\'s license not provided',
        isOverridden: false,
        createdAt: new Date(),
        overriddenAt: null
      };
    }
    return null;
  }
}

class CriminalHistoryRule implements IFlagRule {
  evaluate(application: Application): Flag | null {
    if (application.hasCriminalHistory) {
      return {
        id: crypto.randomUUID(),
        applicationId: application.id,
        type: FlagType.CRIMINAL_HISTORY,
        severity: FlagSeverity.HIGH,
        message: 'Criminal history reported',
        isOverridden: false,
        createdAt: new Date(),
        overriddenAt: null
      };
    }
    return null;
  }
}

class EmploymentGapsRule implements IFlagRule {
  evaluate(application: Application): Flag | null {
    if (application.hasEmploymentGaps) {
      return {
        id: crypto.randomUUID(),
        applicationId: application.id,
        type: FlagType.EMPLOYMENT_GAPS,
        severity: FlagSeverity.MEDIUM,
        message: 'Employment gaps detected',
        isOverridden: false,
        createdAt: new Date(),
        overriddenAt: null
      };
    }
    return null;
  }
}

class EducationVerificationRule implements IFlagRule {
  evaluate(application: Application): Flag | null {
    if (!application.educationVerified) {
      return {
        id: crypto.randomUUID(),
        applicationId: application.id,
        type: FlagType.EDUCATION_VERIFICATION,
        severity: FlagSeverity.HIGH,
        message: 'Education not verified',
        isOverridden: false,
        createdAt: new Date(),
        overriddenAt: null
      };
    }
    return null;
  }
}

class ReferenceCheckRule implements IFlagRule {
  evaluate(application: Application): Flag | null {
    if (!application.referencesChecked) {
      return {
        id: crypto.randomUUID(),
        applicationId: application.id,
        type: FlagType.REFERENCE_CHECK,
        severity: FlagSeverity.MEDIUM,
        message: 'References not checked',
        isOverridden: false,
        createdAt: new Date(),
        overriddenAt: null
      };
    }
    return null;
  }
}

class SocialMediaPresenceRule implements IFlagRule {
  evaluate(application: Application): Flag | null {
    if (!application.socialMediaChecked) {
      return {
        id: crypto.randomUUID(),
        applicationId: application.id,
        type: FlagType.SOCIAL_MEDIA_PRESENCE,
        severity: FlagSeverity.LOW,
        message: 'Social media presence not checked',
        isOverridden: false,
        createdAt: new Date(),
        overriddenAt: null
      };
    }
    return null;
  }
}

class SkillsAssessmentRule implements IFlagRule {
  evaluate(application: Application): Flag | null {
    if (!application.skillsAssessed) {
      return {
        id: crypto.randomUUID(),
        applicationId: application.id,
        type: FlagType.SKILLS_ASSESSMENT,
        severity: FlagSeverity.HIGH,
        message: 'Skills not assessed',
        isOverridden: false,
        createdAt: new Date(),
        overriddenAt: null
      };
    }
    return null;
  }
}

class LanguageProficiencyRule implements IFlagRule {
  evaluate(application: Application): Flag | null {
    if (!application.languageProficiencyVerified) {
      return {
        id: crypto.randomUUID(),
        applicationId: application.id,
        type: FlagType.LANGUAGE_PROFICIENCY,
        severity: FlagSeverity.HIGH,
        message: 'Language proficiency not verified',
        isOverridden: false,
        createdAt: new Date(),
        overriddenAt: null
      };
    }
    return null;
  }
}

class WorkAuthorizationRule implements IFlagRule {
  evaluate(application: Application): Flag | null {
    if (!application.workAuthorizationVerified) {
      return {
        id: crypto.randomUUID(),
        applicationId: application.id,
        type: FlagType.WORK_AUTHORIZATION,
        severity: FlagSeverity.HIGH,
        message: 'Work authorization not verified',
        isOverridden: false,
        createdAt: new Date(),
        overriddenAt: null
      };
    }
    return null;
  }
} 
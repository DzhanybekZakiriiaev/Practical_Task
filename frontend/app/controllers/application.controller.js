angular.module('candidateEvaluation')
    .controller('ApplicationController', ['$location', 'ApplicationService', 'FlagService', 'AuthService', function($location, ApplicationService, FlagService, AuthService) {
        const vm = this;
        
        vm.applications = [];
        vm.currentApplication = null;
        vm.statuses = ApplicationService.getApplicationStatuses();
        vm.flagTypes = FlagService.getFlagTypes();
        vm.errorMessage = '';
        vm.showModal = false;
        vm.isReviewer = false;
        vm.pageTitle = 'My Applications';
        vm.loading = false;

        // Check if user is a reviewer
        function checkUserRole() {
            const currentUser = AuthService.getCurrentUser();
            vm.isReviewer = currentUser && currentUser.role === 'REVIEWER';
            vm.pageTitle = vm.isReviewer ? 'All Applications' : 'My Applications';
        }

        vm.newApplication = {
            // Personal Information
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            dob: '',
            citizenship: '',
            
            // Medical Education
            medicalSchool: '',
            medDegreeProgram: '',
            yearGraduation: '',
            languageOfEducation: '',
            
            // Post-Graduate Training
            postGradCompleted: false,
            rotationsCompleted: false,
            monthsPostGradTraining: '',
            monthsIndependentPractice: '',
            canadianPracticeCriteriaMet: false,
            
            // Driver's License
            driversLicense: false,
            driversLicenseType: '',
            
            // Background Information
            hasCriminalHistory: false,
            hasEmploymentGaps: false,
            
            // English Proficiency
            englishExam: '',
            englishExamScore: '',
            englishProficiencyExpired: false,
            activeUseOfEnglish: false,
            
            // TDM Information
            tdmWritten: false,
            tdmResult: '',
            
            // Exam Dates
            nacDate: '',
            mccqe1Date: '',
            mccqe2Date: '',
            
            // Other Jurisdiction
            otherJurisdictionParticipation: false,
            
            // Verification Status
            educationVerified: false,
            referencesChecked: false,
            socialMediaChecked: false,
            skillsAssessed: false,
            languageProficiencyVerified: false,
            workAuthorizationVerified: false
        };

        function loadApplications() {
            vm.loading = true;
            vm.errorMessage = '';
            console.log('Loading applications from backend...');
            
            ApplicationService.getAllApplications()
                .then(function(response) {
                    console.log('Successfully loaded applications:', response.data);
                    console.log('Number of applications:', response.data.length);
                    
                    // If user is not a reviewer, filter applications by user ID
                    if (!vm.isReviewer) {
                        const currentUser = AuthService.getCurrentUser();
                        vm.applications = response.data.filter(app => app.userId === currentUser.id);
                        console.log('Filtered applications for current user:', vm.applications);
                    } else {
                        vm.applications = response.data;
                    }
                })
                .catch(function(error) {
                    console.error('Error loading applications:', error);
                    vm.errorMessage = 'Failed to load applications. Please try again.';
                })
                .finally(function() {
                    vm.loading = false;
                });
        }

        vm.loadApplication = function(applicationId) {
            console.log('Loading application with ID:', applicationId);
            ApplicationService.getApplication(applicationId)
                .then(function(response) {
                    console.log('Successfully loaded application:', response.data);
                    vm.currentApplication = response.data;
                })
                .catch(function(error) {
                    console.error('Error loading application:', error);
                });
        };

        vm.createApplication = function(application) {
            vm.loading = true;
            vm.errorMessage = '';
            
            // Add current user ID to the application
            const currentUser = AuthService.getCurrentUser();
            const applicationData = {
                ...application,
                userId: currentUser.id
            };

            console.log('Creating new application:', applicationData);
            ApplicationService.createApplication(applicationData)
                .then(function(response) {
                    console.log('Successfully created application:', response.data);
                    const newApplication = response.data.application || response.data;
                    vm.applications.unshift(newApplication);
                    vm.closeModal();
                    resetForm();
                })
                .catch(function(error) {
                    console.error('Error creating application:', error);
                    vm.errorMessage = 'Failed to create application. Please try again.';
                })
                .finally(function() {
                    vm.loading = false;
                });
        };

        vm.updateApplication = function(applicationId, applicationData) {
            ApplicationService.updateApplication(applicationId, applicationData)
                .then(function(response) {
                    const index = vm.applications.findIndex(app => app.id === applicationId);
                    if (index !== -1) {
                        vm.applications[index] = response.data;
                    }
                    vm.currentApplication = response.data;
                })
                .catch(function(error) {
                    console.error('Error updating application:', error);
                });
        };

        vm.evaluateApplication = function(applicationId) {
            FlagService.evaluateApplication(applicationId)
                .then(function(response) {
                    vm.currentApplication.flags = response.data;
                })
                .catch(function(error) {
                    console.error('Error evaluating application:', error);
                });
        };

        vm.overrideFlag = function(flagId) {
            FlagService.overrideFlag(flagId)
                .then(function(response) {
                    const flag = vm.currentApplication.flags.find(f => f.id === flagId);
                    if (flag) {
                        flag.isOverridden = true;
                    }
                })
                .catch(function(error) {
                    console.error('Error overriding flag:', error);
                });
        };

        vm.viewApplication = function(applicationId) {
            $location.path('/applications/' + applicationId);
        };

        vm.openModal = function() {
            vm.showModal = true;
        };
        
        vm.closeModal = function() {
            // Get the modal element
            const modal = document.getElementById('applicationModal');
            if (modal) {
                // Get the Bootstrap modal instance
                const modalInstance = bootstrap.Modal.getInstance(modal);
                if (modalInstance) {
                    // Hide the modal
                    modalInstance.hide();
                }
            }
        };

        function resetForm() {
            // Reset the newApplication object
            vm.newApplication = {
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                dob: '',
                citizenship: '',
                medicalSchool: '',
                medDegreeProgram: '',
                yearGraduation: '',
                languageOfEducation: '',
                postGradCompleted: false,
                rotationsCompleted: false,
                monthsPostGradTraining: '',
                monthsIndependentPractice: '',
                canadianPracticeCriteriaMet: false,
                driversLicense: false,
                driversLicenseType: '',
                hasCriminalHistory: false,
                hasEmploymentGaps: false,
                englishExam: '',
                englishExamScore: '',
                englishProficiencyExpired: false,
                activeUseOfEnglish: false,
                tdmWritten: false,
                tdmResult: '',
                nacDate: '',
                mccqe1Date: '',
                mccqe2Date: '',
                otherJurisdictionParticipation: false,
                educationVerified: false,
                referencesChecked: false,
                socialMediaChecked: false,
                skillsAssessed: false,
                languageProficiencyVerified: false,
                workAuthorizationVerified: false
            };
        }

        // Initialize controller
        checkUserRole();
        loadApplications();
    }]); 
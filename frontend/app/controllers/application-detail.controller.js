angular.module('candidateEvaluation')
    .controller('ApplicationDetailController', ['$routeParams', '$location', 'ApplicationService', 'FlagService', 'AuthService', 'UserService',
        function($routeParams, $location, ApplicationService, FlagService, AuthService, UserService) {
            var vm = this;
            
            vm.application = null;
            vm.flags = [];
            vm.errorMessage = '';
            vm.successMessage = '';
            vm.isReviewer = false;
            vm.loading = false;
            vm.selectedFlag = null;
            vm.overrideReason = '';
            vm.overrideModal = null;
            vm.userNames = {}; // Cache for user names
            vm.applicationId = $location.path().split('/').pop();

            // Check if user is a reviewer
            function checkUserRole() {
                const currentUser = AuthService.getCurrentUser();
                vm.isReviewer = currentUser && currentUser.role === 'REVIEWER';
            }

            // Helper function to get user's full name
            function loadUserName(userId) {
                if (vm.userNames[userId]) {
                    return Promise.resolve(vm.userNames[userId]);
                }

                return UserService.getUserById(userId)
                    .then(function(response) {
                        const user = response.data;
                        const fullName = `${user.firstName} ${user.lastName}`;
                        vm.userNames[userId] = fullName;
                        return fullName;
                    })
                    .catch(function(error) {
                        console.error('Error loading user details:', error);
                        return 'Unknown User';
                    });
            }
            
            function loadApplication() {
                vm.loading = true;
                console.log('Loading application with ID:', vm.applicationId);

                ApplicationService.getApplication(vm.applicationId)
                    .then(function(response) {
                        console.log('Successfully loaded application:', response.data);
                        
                        // Handle nested application data structure
                        if (response.data.application) {
                            vm.application = response.data.application;
                            vm.flags = response.data.flags || [];
                        } else {
                            vm.application = response.data;
                        }
                        
                        // Only set default status if it's not already set
                        if (!vm.application.status) {
                            console.log('No status found, setting default to PENDING');
                            vm.application.status = 'PENDING';
                        } else {
                            // Ensure status is uppercase
                            vm.application.status = vm.application.status.toUpperCase();
                            console.log('Using existing status:', vm.application.status);
                        }

                        // Only load flags if user is a reviewer and we don't already have them
                        if (vm.isReviewer && !response.data.flags) {
                            return FlagService.getFlagsForApplication(vm.applicationId);
                        }
                    })
                    .then(function(response) {
                        if (response) {
                            console.log('Successfully loaded flags:', response.data);
                            vm.flags = response.data;
                            
                            // Load user names for overridden flags
                            const promises = vm.flags
                                .filter(flag => flag.isOverridden && flag.overriddenBy)
                                .map(flag => loadUserName(flag.overriddenBy)
                                    .then(name => {
                                        flag.overriddenByName = name;
                                    }));
                            
                            return Promise.all(promises);
                        }
                    })
                    .catch(function(error) {
                        console.error('Error loading application:', error);
                        vm.errorMessage = 'Failed to load application. Please try again.';
                    })
                    .finally(function() {
                        vm.loading = false;
                    });
            }
            
            vm.updateApplication = function() {
                vm.errorMessage = '';
                vm.successMessage = '';
                
                ApplicationService.updateApplication(vm.applicationId, vm.application)
                    .then(function(response) {
                        vm.successMessage = 'Application updated successfully';
                        // Update local application data with response
                        if (response.data.application) {
                            vm.application = response.data.application;
                        } else {
                            vm.application = response.data;
                        }
                    })
                    .catch(function(error) {
                        vm.errorMessage = error.data.message || 'Failed to update application';
                    });
            };
            
            vm.withdrawApplication = function() {
                // Only allow withdrawal if user is not a reviewer
                if (vm.isReviewer) {
                    vm.errorMessage = 'Reviewers cannot withdraw applications';
                    return;
                }

                if (!vm.applicationId) {
                    vm.errorMessage = 'Application ID not found';
                    return;
                }

                if (confirm('Are you sure you want to withdraw this application? This action cannot be undone.')) {
                    console.log('Withdrawing application:', vm.applicationId);
                    
                    const updateData = {
                        status: 'WITHDRAWN'
                    };
                    
                    ApplicationService.updateApplication(vm.applicationId, updateData)
                        .then(function(response) {
                            console.log('Successfully withdrew application:', response);
                            vm.successMessage = 'Application withdrawn successfully.';
                            // Update local application data with response
                            if (response.data.application) {
                                vm.application = response.data.application;
                            } else {
                                vm.application = response.data;
                            }
                        })
                        .catch(function(error) {
                            console.error('Error withdrawing application:', error);
                            vm.errorMessage = error.data?.message || 'Failed to withdraw application. Please try again.';
                        });
                }
            };
            
            vm.openOverrideModal = function(flag) {
                vm.selectedFlag = flag;
                vm.overrideReason = '';
                vm.errorMessage = '';
                vm.successMessage = '';

                // Initialize modal if not already done
                if (!vm.overrideModal) {
                    vm.overrideModal = new bootstrap.Modal(document.getElementById('overrideModal'));
                }
                vm.overrideModal.show();
            };

            vm.submitOverride = function() {
                if (!vm.selectedFlag || !vm.overrideReason) {
                    vm.errorMessage = 'Please provide an override reason';
                    return;
                }

                FlagService.overrideFlag(vm.selectedFlag.id, vm.overrideReason)
                    .then(function(response) {
                        console.log('Successfully overridden flag:', response.data);
                        const flag = vm.flags.find(f => f.id === vm.selectedFlag.id);
                        if (flag) {
                            flag.isOverridden = true;
                            flag.overriddenAt = response.data.overriddenAt;
                            flag.overriddenBy = response.data.overriddenBy;
                            flag.overrideReason = response.data.overrideReason;
                            
                            // Load the user's name
                            loadUserName(flag.overriddenBy)
                                .then(name => {
                                    flag.overriddenByName = name;
                                });
                        }
                        vm.successMessage = 'Flag successfully overridden';
                        vm.overrideModal.hide();
                    })
                    .catch(function(error) {
                        console.error('Error overriding flag:', error);
                        vm.errorMessage = error.data?.error || 'Failed to override flag. Please try again.';
                    });
            };
            
            vm.goBack = function() {
                $location.path('/applications');
            };
            
            vm.updateStatus = function() {
                if (!vm.isReviewer) {
                    vm.errorMessage = 'Only reviewers can update application status';
                    return;
                }

                vm.errorMessage = '';
                vm.successMessage = '';
                
                const updateData = {
                    status: vm.application.status
                };
                
                ApplicationService.updateApplication(vm.applicationId, updateData)
                    .then(function(response) {
                        console.log('Successfully updated application status:', response);
                        vm.successMessage = 'Application status updated successfully';
                    })
                    .catch(function(error) {
                        console.error('Error updating application status:', error);
                        vm.errorMessage = error.data?.message || 'Failed to update application status';
                        // Revert the status if update failed
                        loadApplication();
                    });
            };
            
            // Initialize controller
            checkUserRole();
            loadApplication();
        }
    ]); 
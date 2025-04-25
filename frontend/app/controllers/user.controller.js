angular.module('candidateEvaluation')
    .controller('UserController', ['$scope', '$location', 'UserService', 'AuthService', 
        function($scope, $location, UserService, AuthService) {
            var vm = this;
            vm.userData = {};
            vm.loading = false;
            vm.errorMessage = '';
            vm.successMessage = '';
            vm.roles = UserService.getUserRoles();

            // Listen for auth events
            $scope.$on('auth:logout', function() {
                vm.userData = {};
                vm.errorMessage = 'You have been logged out';
                $location.path('/login');
            });

            $scope.$on('auth:updated', function() {
                vm.loadUserProfile();
            });

            vm.loadUserProfile = function() {
                if (!AuthService.isAuthenticated()) {
                    vm.errorMessage = 'Please log in to view your profile';
                    $location.path('/login');
                    return;
                }

                vm.loading = true;
                vm.errorMessage = '';
                vm.successMessage = '';

                UserService.getCurrentUser()
                    .then(function(response) {
                        vm.userData = response.data;
                    })
                    .catch(function(error) {
                        if (AuthService.handleAuthError(error)) {
                            return;
                        }
                        vm.errorMessage = 'Failed to load profile: ' + (error.data?.message || error.message || 'Unknown error');
                    })
                    .finally(function() {
                        vm.loading = false;
                    });
            };

            vm.updateProfile = function() {
                if (!AuthService.isAuthenticated()) {
                    vm.errorMessage = 'Please log in to update your profile';
                    $location.path('/login');
                    return;
                }

                vm.loading = true;
                vm.errorMessage = '';
                vm.successMessage = '';

                UserService.updateCurrentUser(vm.userData)
                    .then(function(response) {
                        vm.userData = response.data;
                        vm.successMessage = 'Profile updated successfully';
                    })
                    .catch(function(error) {
                        if (AuthService.handleAuthError(error)) {
                            return;
                        }
                        vm.errorMessage = 'Failed to update profile: ' + (error.data?.message || error.message || 'Unknown error');
                    })
                    .finally(function() {
                        vm.loading = false;
                    });
            };

            // Initialize controller
            vm.loadUserProfile();
    }]); 
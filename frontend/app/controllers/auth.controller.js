angular.module('candidateEvaluation')
    .controller('AuthController', ['$scope', '$location', 'AuthService', 'UserService',
        function($scope, $location, AuthService, UserService) {
            var vm = this;
            
            vm.loginData = {
                email: '',
                password: ''
            };
            
            vm.registerData = {
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                isReviewer: false // Initialize checkbox state
            };
            
            vm.availableRoles = UserService.getUserRoles();
            vm.errorMessage = '';
            
            vm.login = function() {
                vm.errorMessage = '';
                AuthService.login(vm.loginData)
                    .then(function(response) {
                        console.log('Login successful, user data:', response.user); // Debug log
                        $location.path('/applications');
                    })
                    .catch(function(error) {
                        console.error('Login error:', error); // Debug log
                        vm.errorMessage = error.data?.message || error.message || 'Login failed';
                    });
            };
            
            vm.register = function() {
                vm.errorMessage = '';
                
                // Create registration data with role based on checkbox
                const registrationData = {
                    firstName: vm.registerData.firstName,
                    lastName: vm.registerData.lastName,
                    email: vm.registerData.email,
                    password: vm.registerData.password,
                    role: vm.registerData.isReviewer ? 'REVIEWER' : 'APPLICANT'
                };
                
                console.log('Registering with data:', registrationData);
                
                AuthService.register(registrationData)
                    .then(function(response) {
                        console.log('Registration successful:', response); // Debug log
                        // After successful registration, redirect to login
                        $location.path('/login');
                    })
                    .catch(function(error) {
                        console.error('Registration error:', error); // Debug log
                        vm.errorMessage = error.data?.message || error.message || 'Registration failed';
                    });
            };
            
            vm.logout = function() {
                AuthService.logout();
                $location.path('/login');
            };

            // Check if current page is an auth page (login or register)
            vm.isAuthPage = function() {
                var currentPath = $location.path();
                return currentPath === '/login' || currentPath === '/register';
            };

            vm.isAuthenticated = function() {
                return AuthService.isAuthenticated();
            };

            // Function to determine if navbar should be shown
            vm.showNavbar = function() {
                return !vm.isAuthPage();
            };

            // Listen for auth events to update the view
            $scope.$on('auth:logout', function() {
                $location.path('/login');
            });

            $scope.$on('auth:updated', function() {
                // Force a digest cycle to update the nav items visibility
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
            });

            // Listen for route changes to update navbar visibility
            $scope.$on('$routeChangeSuccess', function() {
                // Force a digest cycle to update the nav visibility
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
            });
        }
    ]); 
angular.module('candidateEvaluation')
    .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
        $locationProvider.hashPrefix('');
        
        $routeProvider
            .when('/login', {
                templateUrl: 'app/templates/login.html',
                controller: 'LoginController'
            })
            .when('/register', {
                templateUrl: 'app/templates/register.html',
                controller: 'RegisterController'
            })
            .when('/profile', {
                templateUrl: 'app/templates/profile.html',
                controller: 'ProfileController',
                resolve: {
                    auth: ['AuthService', function(AuthService) {
                        return AuthService.checkAuth();
                    }]
                }
            })
            .when('/application/submit', {
                templateUrl: 'app/templates/submit-application.html',
                controller: 'SubmitApplicationController',
                resolve: {
                    auth: ['AuthService', function(AuthService) {
                        return AuthService.checkAuth();
                    }]
                }
            })
            .when('/application/mine', {
                templateUrl: 'app/templates/my-applications.html',
                controller: 'MyApplicationsController',
                resolve: {
                    auth: ['AuthService', function(AuthService) {
                        return AuthService.checkAuth();
                    }]
                }
            })
            .when('/application/:id', {
                templateUrl: 'app/templates/application-details.html',
                controller: 'ApplicationDetailsController',
                resolve: {
                    auth: ['AuthService', function(AuthService) {
                        return AuthService.checkAuth();
                    }]
                }
            })
            .when('/reviewer/applications', {
                templateUrl: 'app/templates/reviewer-applications.html',
                controller: 'AllApplicationsController',
                resolve: {
                    auth: ['AuthService', function(AuthService) {
                        return AuthService.checkAuth();
                    }]
                }
            })
            .when('/reviewer/application/:id', {
                templateUrl: 'app/templates/review-application.html',
                controller: 'ReviewApplicationController',
                resolve: {
                    auth: ['AuthService', function(AuthService) {
                        return AuthService.checkAuth();
                    }]
                }
            })
            .otherwise({
                redirectTo: '/login'
            });
    }]); 
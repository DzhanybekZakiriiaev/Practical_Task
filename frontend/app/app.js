angular.module('candidateEvaluation', ['ngRoute'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/login', {
                templateUrl: 'app/views/login.html',
                controller: 'AuthController',
                controllerAs: 'auth'
            })
            .when('/register', {
                templateUrl: 'app/views/register.html',
                controller: 'AuthController',
                controllerAs: 'auth'
            })
            .when('/applications', {
                templateUrl: 'app/views/applications.html',
                controller: 'ApplicationController',
                controllerAs: 'vm',
                requireAuth: true
            })
            .when('/applications/:id', {
                templateUrl: 'app/views/application-detail.html',
                controller: 'ApplicationDetailController',
                controllerAs: 'appDetail',
                requireAuth: true
            })
            .when('/profile', {
                templateUrl: 'app/views/profile.html',
                controller: 'UserController',
                controllerAs: 'user',
                requireAuth: true
            })
            .otherwise({
                redirectTo: '/applications'
            });
    }])
    .run(['$rootScope', '$location', 'AuthService', 
        function($rootScope, $location, AuthService) {
            $rootScope.$on('$routeChangeStart', function(event, next) {
                if (next.requireAuth && !AuthService.isAuthenticated()) {
                    $location.path('/login');
                }
            });
        }
    ]); 
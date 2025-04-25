angular.module('candidateEvaluation')
    .service('AuthService', ['$http', '$window', '$rootScope', function($http, $window, $rootScope) {
        const API_URL = 'http://localhost:3000/api';
        const TOKEN_KEY = 'auth_token';
        const USER_KEY = 'user_data';

        this.login = function(credentials) {
            return $http.post(`${API_URL}/auth/login`, credentials)
                .then(response => {
                    if (!response.data.user || !response.data.user.role) {
                        throw new Error('Invalid user data received');
                    }
                    this.setAuthData(response.data);
                    return response.data;
                });
        };

        this.register = function(userData) {
            console.log('Sending registration data to server:', userData);
            return $http.post(`${API_URL}/auth/register`, userData)
                .then(response => {
                    console.log('Server response for registration:', response.data);
                    return response.data;
                });
        };

        this.logout = function() {
            $window.localStorage.removeItem(TOKEN_KEY);
            $window.localStorage.removeItem(USER_KEY);
            $rootScope.$broadcast('auth:logout');
        };

        this.setAuthData = function(data) {
            if (data.token) {
                $window.localStorage.setItem(TOKEN_KEY, data.token);
            }
            if (data.user) {
                // Store the user data exactly as received from the server
                $window.localStorage.setItem(USER_KEY, JSON.stringify(data.user));
                console.log('Stored user data:', data.user);
            }
            $rootScope.$broadcast('auth:updated');
        };

        this.isAuthenticated = function() {
            const token = this.getToken();
            return !!token && this.isTokenValid(token);
        };

        this.isTokenValid = function(token) {
            if (!token) return false;
            
            // Check if token exists in storage
            const storedToken = $window.localStorage.getItem(TOKEN_KEY);
            if (token !== storedToken) {
                return false;
            }

            return true;
        };

        this.getToken = function() {
            return $window.localStorage.getItem(TOKEN_KEY);
        };

        this.getCurrentUser = function() {
            const userData = $window.localStorage.getItem(USER_KEY);
            if (!userData) return null;
            
            try {
                const user = JSON.parse(userData);
                console.log('Retrieved user data:', user);
                return user;
            } catch (e) {
                console.error('Error parsing user data:', e);
                return null;
            }
        };

        this.getCurrentUserId = function() {
            const user = this.getCurrentUser();
            return user ? user.id : null;
        };

        this.handleAuthError = function(error) {
            if (error.status === 401 || error.status === 403) {
                this.logout();
                return true;
            }
            return false;
        };
    }]); 
angular.module('candidateEvaluation')
    .service('UserService', ['$http', 'AuthService', function($http, AuthService) {
        const API_URL = 'http://localhost:3000/api';

        function getAuthHeaders() {
            return {
                headers: {
                    'Authorization': 'Bearer ' + AuthService.getToken()
                }
            };
        }

        this.getUserRoles = function() {
            return [
                'ADMIN',
                'RECRUITER',
                'HIRING_MANAGER',
                'INTERVIEWER'
            ];
        };

        this.getCurrentUser = function() {
            return $http.get(`${API_URL}/users/profile`, getAuthHeaders())
                .catch(function(error) {
                    console.error('Error fetching user profile:', error);
                    throw error;
                });
        };

        this.getUserById = function(userId) {
            return $http.get(`${API_URL}/users/${userId}`, getAuthHeaders())
                .catch(function(error) {
                    console.error('Error fetching user details:', error);
                    throw error;
                });
        };

        this.updateCurrentUser = function(userData) {
            return $http.put(`${API_URL}/users/profile`, userData, getAuthHeaders())
                .catch(function(error) {
                    console.error('Error updating user profile:', error);
                    throw error;
                });
        };

        this.deleteCurrentUser = function() {
            return $http.delete(`${API_URL}/users/profile`, getAuthHeaders())
                .catch(function(error) {
                    console.error('Error deleting user profile:', error);
                    throw error;
                });
        };

        this.changeCurrentUserRole = function(role) {
            return $http.put(`${API_URL}/users/profile/role`, { role }, getAuthHeaders())
                .catch(function(error) {
                    console.error('Error changing user role:', error);
                    throw error;
                });
        };
    }]); 
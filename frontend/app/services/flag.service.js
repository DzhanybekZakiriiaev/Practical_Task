angular.module('candidateEvaluation')
    .service('FlagService', ['$http', 'AuthService', function($http, AuthService) {
        const API_URL = 'http://localhost:3000/api/flags';

        this.evaluateApplication = function(applicationId) {
            return $http.post(`${API_URL}/evaluate/${applicationId}`);
        };

        this.getFlagsForApplication = function(applicationId) {
            return $http.get(`${API_URL}/application/${applicationId}`);
        };

        this.overrideFlag = function(flagId, overrideReason) {
            const currentUser = AuthService.getCurrentUser();
            return $http.post(`${API_URL}/${flagId}/override`, {
                userId: currentUser.id,
                overrideReason: overrideReason
            });
        };

        this.getFlagTypes = function() {
            return $http.get(`${API_URL}/types`);
        };
    }]); 
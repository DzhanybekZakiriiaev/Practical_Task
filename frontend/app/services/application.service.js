angular.module('candidateEvaluation')
    .service('ApplicationService', ['$http', 'AuthService', function($http, AuthService) {
        const API_URL = 'http://localhost:3000/api';

        this.getAllApplications = function() {
            console.log('Making GET request to fetch all applications');
            return $http.get(`${API_URL}/applications`, {
                headers: {
                    'Authorization': 'Bearer ' + AuthService.getToken()
                }
            });
        };

        this.getApplication = function(id) {
            console.log('Making GET request to fetch application with ID:', id);
            return $http.get(`${API_URL}/applications/${id}`, {
                headers: {
                    'Authorization': 'Bearer ' + AuthService.getToken()
                }
            });
        };

        this.createApplication = function(application) {
            console.log('Making POST request to create application');
            // Format dates before sending
            const formattedApplication = {
                ...application,
                dob: application.dob ? new Date(application.dob).toISOString() : null,
                nacDate: application.nacDate ? new Date(application.nacDate).toISOString() : null,
                mccqe1Date: application.mccqe1Date ? new Date(application.mccqe1Date).toISOString() : null,
                mccqe2Date: application.mccqe2Date ? new Date(application.mccqe2Date).toISOString() : null
            };
            
            console.log('Sending formatted application data:', formattedApplication);
            return $http.post(`${API_URL}/applications/evaluate`, formattedApplication, {
                headers: {
                    'Authorization': 'Bearer ' + AuthService.getToken()
                }
            });
        };

        this.updateApplication = function(id, application) {
            console.log('Making PUT request to update application with ID:', id);
            // Format dates before sending
            const formattedApplication = {
                ...application,
                dob: application.dob ? new Date(application.dob).toISOString() : null,
                nacDate: application.nacDate ? new Date(application.nacDate).toISOString() : null,
                mccqe1Date: application.mccqe1Date ? new Date(application.mccqe1Date).toISOString() : null,
                mccqe2Date: application.mccqe2Date ? new Date(application.mccqe2Date).toISOString() : null
            };
            
            console.log('Sending formatted update data:', formattedApplication);
            return $http.put(`${API_URL}/applications/${id}`, formattedApplication, {
                headers: {
                    'Authorization': 'Bearer ' + AuthService.getToken()
                }
            });
        };

        this.getApplicationStatuses = function() {
            return [
                'PENDING',
                'IN_REVIEW',
                'APPROVED',
                'REJECTED',
                'WITHDRAWN'
            ];
        };
    }]); 
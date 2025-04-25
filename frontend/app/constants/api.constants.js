angular.module('candidateEvaluation')
    .constant('API', {
        BASE_URL: 'http://localhost:3000/api',
        ENDPOINTS: {
            AUTH: {
                LOGIN: '/auth/login',
                REGISTER: '/auth/register'
            },
            USER: {
                PROFILE: '/users',
                UPDATE: '/users'
            },
            APPLICATION: {
                CREATE: '/applications',
                GET_ALL: '/applications',
                GET_ONE: '/applications',
                EVALUATE: '/applications/evaluate'
            },
            FLAG: {
                OVERRIDE: '/flags/override'
            }
        }
    }); 
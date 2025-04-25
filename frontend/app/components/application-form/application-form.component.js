angular.module('candidateEvaluation')
    .component('applicationForm', {
        templateUrl: 'app/components/application-form/application-form.html',
        bindings: {
            application: '<',
            onSubmit: '&',
            onCancel: '&',
            isReadOnly: '<'
        },
        controller: ['$scope', '$element', function($scope, $element) {
            const $ctrl = this;
            
            // Initialize the application object and read-only state
            $ctrl.application = {};
            $ctrl.isReadOnly = false;
            
            // Initialize PrimeNG components
            $scope.$on('$viewContentLoaded', function() {
                console.log('View content loaded, application data:', $ctrl.application);
                console.log('View content loaded, isReadOnly:', $ctrl.isReadOnly);
            });
            
            // Watch for changes in the application data
            $ctrl.$onChanges = function(changes) {
                console.log('Changes detected:', changes);
                
                if (changes.application && changes.application.currentValue) {
                    console.log('Application data changed:', changes.application.currentValue);
                    
                    // Create a deep copy of the application data
                    const newApplication = angular.copy(changes.application.currentValue.application || changes.application.currentValue);
                    
                    // Format dates for display
                    if (newApplication.dob) {
                        newApplication.dob = new Date(newApplication.dob).toISOString().split('T')[0];
                    }
                    if (newApplication.nacDate) {
                        newApplication.nacDate = new Date(newApplication.nacDate).toISOString().split('T')[0];
                    }
                    if (newApplication.mccqe1Date) {
                        newApplication.mccqe1Date = new Date(newApplication.mccqe1Date).toISOString().split('T')[0];
                    }
                    if (newApplication.mccqe2Date) {
                        newApplication.mccqe2Date = new Date(newApplication.mccqe2Date).toISOString().split('T')[0];
                    }
                    
                    // Update the application object
                    $ctrl.application = newApplication;
                    
                    // Force a digest cycle to update the view
                    $scope.$evalAsync(function() {
                        console.log('Forcing view update with application:', $ctrl.application);
                    });
                }

                if (changes.isReadOnly) {
                    console.log('Read-only state changed:', changes.isReadOnly.currentValue);
                    $ctrl.isReadOnly = changes.isReadOnly.currentValue;
                }
            };

            // Watch for any changes in the application object
            $scope.$watchCollection('$ctrl.application', function(newVal, oldVal) {
                if (newVal !== oldVal) {
                    console.log('Application watched in component:', newVal);
                    // Force a digest cycle to update the view
                    $scope.$evalAsync(function() {
                        console.log('View updated with application:', $ctrl.application);
                    });
                }
            });
            
            $ctrl.submit = function() {
                // Remove focus from any active element
                document.activeElement.blur();
                
                // Call the submit handler
                $ctrl.onSubmit({application: $ctrl.application});
            };
            
            $ctrl.cancel = function() {
                // Remove focus from any active element
                document.activeElement.blur();
                
                // Call the cancel handler
                $ctrl.onCancel();
            };

            // Log initial state
            console.log('Component initialized with application:', $ctrl.application);
            console.log('Component initialized with isReadOnly:', $ctrl.isReadOnly);
        }]
    }); 
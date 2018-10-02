(function (root, angular) {
    'use strict';

    var app = root.getModule();

    app.directive('dogSelect',
        function () {

            var controller = function ($scope) {

                $scope.selectDog = function (ddSelectedDog) {
                    $scope.selectedDog = angular.copy(ddSelectedDog);
                    $scope.ddSelectedDog = null;
                };

            }

            return {
                restrict: 'A',
                templateUrl: '/Scripts/dog-select.html',          
                controller: controller,
                replace: true,
                scope: {
                    dogs: '=',
                    selectedDog: '='
                }
            };

        });

})(MyAppSettings || (MyAppSettings = {}), window.angular);

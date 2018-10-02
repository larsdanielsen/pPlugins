(function (angular) {
    'use strict';

    var app = angular.module('onLastRepeat', []);

    app.directive('onLastRepeat',
        function () {
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {
                    if (scope.$last) {
                        setTimeout(function() { scope.$emit('onLastRepeat', element, attrs); }, 1);
                    }
                }
            };
        });
})(window.angular);
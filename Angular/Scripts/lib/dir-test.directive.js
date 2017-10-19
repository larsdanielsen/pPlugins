(function (root) {
    'use strict';
    var app = root.getModule();

    app.directive('dirTest',
        function () {
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {
                    scope.myVar.BreedName = 'changed';
                },
                scope: {
                    myVar: '='
                }
            };
        });
})(MyAppSettings || (MyAppSettings = {}));
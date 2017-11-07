(function (root) {
    'use strict';

    var app = root.getModule();

    app.directive('cgRounded',
        function () {
            return {
                restrict: 'A',
                templateUrl: '/Styler/EditorMixins/rounded-directive.html',
                replace: true,
                scope: {
                    mixin: '=cgRounded'
                },
                controller: function ($scope, editorFactory) {
                    $scope.mode = 'simple';
                    $scope.editors = {
                        all: $scope.mixin.initialValues.topLeft,
                        top: $scope.mixin.initialValues.topLeft,
                        bottom: $scope.mixin.initialValues.bottomLeft
                    };

                    $scope.$watch('mixin.initialValues.topLeft', function (newValue) {
                        $scope.editors.all = newValue;
                        $scope.editors.top = newValue;
                    });

                    $scope.$watch('mixin.initialValues.bottomLeft', function (newValue) {
                        $scope.editors.bottom = newValue;
                    });

                    $scope.$watch('editors.all', function (newValue) {
                        if ($scope.mode == 'simple') {
                            $scope.mixin.initialValues.topLeft = newValue;
                            $scope.mixin.initialValues.topRight = newValue;
                            $scope.mixin.initialValues.bottomLeft = newValue;
                            $scope.mixin.initialValues.bottomRight = newValue;
                        }
                    });
                    $scope.$watch('editors.top', function (newValue) {
                        if ($scope.mode == 'topbottom') {
                            $scope.mixin.initialValues.topLeft = newValue;
                            $scope.mixin.initialValues.topRight = newValue;
                        }
                    });
                    $scope.$watch('editors.bottom', function (newValue) {
                        if ($scope.mode == 'topbottom') {
                            $scope.mixin.initialValues.bottomLeft = newValue;
                            $scope.mixin.initialValues.bottomRight = newValue;
                        }
                    });
                    $scope.$watch('editors.all', function (newValue) {
                        if ($scope.mode == 'simple') {
                            $scope.mixin.initialValues.topLeft = newValue;
                            $scope.mixin.initialValues.topRight = newValue;
                            $scope.mixin.initialValues.bottomLeft = newValue;
                            $scope.mixin.initialValues.bottomRight = newValue;
                        }
                    });



                }
            };
        });
})(MyStylerAppSettings || (MyStylerAppSettings = {}));
(function (root) {
    'use strict';

    var app = root.getModule();

    app.directive('editorMixin',
        function () {
            return {
                restrict: 'AE',
                template: '<ng-include src="getTemplateUrl()"/>',                
                replace: true,
                scope: {
                    mixin: '=editorMixin'
                },
                controller: function ($scope, mixinNames) {
                    //console.log(mixinNames);
                    $scope.getTemplateUrl = function () {
                        //console.log($scope.mixin.mixinName);
                        switch ($scope.mixin.mixinName) {
                            case mixinNames.Color:
                                return '/Styler/EditorMixins/color-directive.html';
                                break;
                            case mixinNames.BackgroundColor:
                                return '/Styler/EditorMixins/background-color-directive.html';
                                break;
                            case mixinNames.Gradient:
                                return '/Styler/EditorMixins/gradient-directive.html';
                                break;
                        //    default:
                        }
                        return null;
                    }

                }
            };
        });
})(MyStylerAppSettings || (MyStylerAppSettings = {}));
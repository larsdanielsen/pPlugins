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
                controller: function ($scope, editorFactory) {
                    $scope.getTemplateUrl = function () {   
                        switch ($scope.mixin.mixinName) {
                            case editorFactory.mixinNames.Color:
                                return '/Styler/EditorMixins/color-directive.html';
                                break;
                            case editorFactory.mixinNames.BackgroundColor:
                                return '/Styler/EditorMixins/background-color-directive.html';
                                break;
                            case editorFactory.mixinNames.Gradient:
                                return '/Styler/EditorMixins/gradient-directive.html';
                                break;
                            case editorFactory.mixinNames.Rounded:
                                return '/Styler/EditorMixins/rounded-directive-init.html';
                                break;
                        //    default:
                        }
                        return null;
                    }

                }
            };
        });
})(MyStylerAppSettings || (MyStylerAppSettings = {}));
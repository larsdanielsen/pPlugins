(function (root) {
    'use strict';

    var app = root.getModule();

    app.controller('stylerController', function ($scope, editorFactory) {
        console.log("her");
        mockData();
        initModel();

        function initModel() {
            angular.copy($scope.prevalues, $scope.presentationModelMixins = []);
            angular.copy($scope.value, $scope.existingModel = {});
            $scope.presentationModel = {
                className: $scope.existingModel.ClassName,
                mixins: $scope.presentationModelMixins
            }
            angular.forEach($scope.presentationModel.mixins, function (presentationModelMixin) {
                preserveExistingMixinValues(presentationModelMixin, $scope.existingModel);
            });
            $scope.value = getValue($scope.presentationModel);
        }

        $scope.$watch(
            function () {
                $scope.value = getValue($scope.presentationModel);
            }
        );

        function getValue(presentationModel) {
            var value = {
                ClassName: presentationModel.className,
                Mixins: []
            };
            angular.forEach(presentationModel.mixins, function (presentationModelMixin, key, obj) {
                value.Mixins.push(getMixin(presentationModelMixin));
            });
            return value;
        }

        function getMixin(presentationModelMixin) {
            //console.log('getMixin');
            //console.log(presentationModelMixin);
            var newMixin = {
                MixinName: presentationModelMixin.mixinName,
                Values: {}
            };
            getMixinValues(presentationModelMixin, newMixin);
            return newMixin;
        }

        function getMixinValues(presentationModelMixin, newMixin) {
            switch (newMixin.MixinName) {
                case editorFactory.mixinNames.Color:
                    newMixin.Values.Color = presentationModelMixin.initialValues.color;
                    break;
                case editorFactory.mixinNames.BackgroundColor:
                    newMixin.Values.Color = presentationModelMixin.initialValues.color;
                    break;
                case editorFactory.mixinNames.Gradient:
                    newMixin.Values.Color1 = presentationModelMixin.initialValues.color1;
                    newMixin.Values.Color2 = presentationModelMixin.initialValues.color2;
                    break;
                case editorFactory.mixinNames.Rounded:
                    newMixin.Values.TopLeft = presentationModelMixin.initialValues.topLeft;
                    newMixin.Values.TopRight = presentationModelMixin.initialValues.topRight;
                    newMixin.Values.BottomLeft = presentationModelMixin.initialValues.bottomLeft;
                    newMixin.Values.BottomRight = presentationModelMixin.initialValues.bottomRight;
                    break;
                default:
            }
        }

        function preserveExistingMixinValues(presentationModelMixin, existingModel) {
            var existingMixin = getExistingMixin(presentationModelMixin, existingModel.Mixins);
            if (existingMixin) {
                switch (presentationModelMixin.mixinName) {
                    case editorFactory.mixinNames.Color:
                        presentationModelMixin.initialValues = {
                            color: existingMixin.Values.Color
                        };
                        break;
                    case editorFactory.mixinNames.BackgroundColor:
                        presentationModelMixin.Values = {
                            Color: existingMixin.Values.Color
                        };
                        break;
                    case editorFactory.mixinNames.Gradient:
                        presentationModelMixin.Values = {
                            Color1: existingMixin.Values.Color1,
                            Color2: existingMixin.Values.Color2
                        };
                        break;
                    case editorFactory.mixinNames.Rounded:
                        presentationModelMixin.Values = {
                            TopLeft: existingMixin.Values.topLeft,
                            TopRight: existingMixin.Values.topRight,
                            BottomLeft: existingMixin.Values.bottomLeft,
                            BottomRight: existingMixin.Values.bottomRight
                        };
                        break;
                    default:
                }
            }
        }

        function getExistingMixin(presentationModelMixin, existingModelMixins) {
            for (var i = 0; i < existingModelMixins.length; i++) {
                if (existingModelMixins[i].MixinName === presentationModelMixin.mixinName) {
                    return existingModelMixins[i];
                }
            }
            return null;
        }

        function mockData() {
            $scope.value = {
                'ClassName': 'menu-item',
                'Mixins': [
                    {
                        'MixinName': 'Rounded',
                        'Values': {
                            'TopLeft': 5,
                            'TopRight': 5,
                            'BottomLeft': 5,
                            'BottomRight': 5
                        }
                    },
                    {
                        'MixinName': 'BackgroundColor',
                        'Values': {
                            'Color': 'red'
                        }
                    }
                ]
            };


            $scope.prevalues = [];
            //$scope.prevalues.push({
            //    mixinName: 'Color',
            //    initialValues: { color: 'red' }
            //});
            $scope.prevalues.push({
                mixinName: 'Rounded',
                initialValues: { topLeft: 5, topRight: 5, bottomLeft: 5, bottomRight: 5 }
            });
            $scope.prevalues.push({
                mixinName: 'BackgroundColor',
                initialValues: { color: 'red' }
            });
            //$scope.prevalues.push({
            //    mixinName: 'Gradient',
            //    initialValues: { color1: 'red', color2: 'black' }
            //});
            //$scope.prevalues.push({
            //    mixinName: 'Rounded',
            //    initialValues: { topLeft: 5, topRight: 5, bottomLeft: 5, bottomRight: 5 }
            //});
        }


    });
})(MyStylerAppSettings || (MyStylerAppSettings = {}));
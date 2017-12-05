(function (root) {
    'use strict';

    var app = root.getModule();

    app.controller('stylerController', function ($scope, mixinNames) {

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

        $scope.$watch('presentationModel',
            function (newValue, oldValue) {
                console.log($scope.presentationModel.className);
                $scope.value = getValue($scope.presentationModel);
            }, true
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
                case mixinNames.Color:
                    newMixin.Values.Color = presentationModelMixin.initialValues.color;
                    break;
                case mixinNames.BackgroundColor:
                    newMixin.Values.Color = presentationModelMixin.initialValues.color;
                    break;
                case mixinNames.Gradient:
                    newMixin.Values.Color1 = presentationModelMixin.initialValues.color1;
                    newMixin.Values.Color2 = presentationModelMixin.initialValues.color2;
                    break;
                default:
            }
        }

        function preserveExistingMixinValues(presentationModelMixin, existingModel) {
            var existingMixin = getExistingMixin(presentationModelMixin, existingModel.Mixins);
            if (existingMixin) {
                switch (presentationModelMixin.mixinName) {
                    case mixinNames.Color:
                        presentationModelMixin.initialValues = {
                            color: existingMixin.Values.Color
                        };
                        break;
                    case mixinNames.BackgroundColor:
                        presentationModelMixin.initialValues = {
                            color: existingMixin.Values.Color
                        };
                        break;
                    case mixinNames.Gradient:
                        presentationModelMixin.initialValues = {
                            color1: existingMixin.Values.Color1,
                            color2: existingMixin.Values.Color2
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
                        'MixinName': 'Color',
                        'Values': {
                            'Color': 'blue'
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
            $scope.prevalues.push({
                mixinName: 'Color',
                initialValues: { color: 'red' }
            });
            $scope.prevalues.push({
                mixinName: 'BackgroundColor',
                initialValues: { color: 'red' }
            });
            $scope.prevalues.push({
                mixinName: 'Gradient',
                initialValues: { color1: 'red', color2: 'black' }
            });
        }


    });
})(MyStylerAppSettings || (MyStylerAppSettings = {}));
(function (root) {
    'use strict';

    var app = root.getModule();

    app.controller('stylerController', function ($scope, mixinNames) {
        
        mockData();
        initValue();

        function initValue() {
            angular.copy($scope.value.Mixins, $scope.existingMixins = []);
            $scope.value.Mixins = [];
            angular.forEach($scope.prevalues, function (value, key, obj) {
                $scope.value.Mixins.push(getMixin(value, $scope.existingMixins));
            });
        }


        function getMixin(mixin, existingMixins) {

            var existingMixin = getExistingMixin(mixin, existingMixins);

            var newMixin = {
                MixinName: mixin.mixinName
            };

            getMixinValues(mixin, newMixin);
            if (existingMixin !== null) {
                preserveExistingMixinValues(existingMixin, newMixin);
            }

            return newMixin;
        }

        function getMixinValues(mixin, newMixin) {
            switch (newMixin.MixinName) {
                case mixinNames.Color:
                    newMixin.Values = {
                        Color: mixin.initialValues.color
                    };
                    break;
                case mixinNames.BackgroundColor:
                    newMixin.Values = {
                        Color: mixin.initialValues.color
                    };
                    break;
                case mixinNames.Gradient:
                    newMixin.Values = {
                        Color1: mixin.initialValues.color1,
                        Color2: mixin.initialValues.color2
                    };
                    break;
                default:
            }
        }


        function preserveExistingMixinValues(existingMixin, newMixin) {
            switch (newMixin.MixinName) {
                case mixinNames.Color:
                    newMixin.Values = {
                        Color: existingMixin.Values.Color
                    };
                    break;
                case mixinNames.BackgroundColor:
                    newMixin.Values = {
                        Color: existingMixin.Values.Color
                    };
                    break;
                case mixinNames.Gradient:
                    newMixin.Values = {
                        Color1: existingMixin.Values.Color1,
                        Color2: existingMixin.Values.Color2
                    };
                    break;
                default:
            }
        }


        function getExistingMixin(mixin, existingMixins) {
            for (var i = 0; i < existingMixins.length; i++) {
                if (existingMixins[i].MixinName === mixin.mixinName) {
                    return existingMixins[i];
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
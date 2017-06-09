﻿(function () {
    'use strict';

    var app = angular.module('ajaxLoader', []);

    app.directive('ajaxLoader',
        function () {
            return {
                restrict: 'AE',
                template:
                    '<div ng-style="{ transform: getTransform(), opacity: getOpacity(), transition: getTransition() }">Loading ...</div>',
                replace: true,
                scope: {
                    showAfter: '=',
                    hideAfter: '=',
                    animationDuration: '=',
                    handleBeforeUnload: '='
                },
                controller: function ($scope) {

                    var showIt = false;

                    var defaultSettings = {
                        showAfter: 500,
                        hideAfter: 200,
                        animationDuration: 300,
                        handleBeforeUnload: false
                    };

                    var settings = {
                        showAfter: $scope.showAfter === undefined ? defaultSettings.showAfter : parseInt($scope.showAfter),
                        hideAfter: $scope.hideAfter === undefined ? defaultSettings.hideAfter : parseInt($scope.hideAfter),
                        animationDuration: $scope.animationDuration === undefined ? defaultSettings.animationDuration : parseInt($scope.animationDuration),
                        handleBeforeUnload: $scope.handleBeforeUnload === undefined ? defaultSettings.handleBeforeUnload : $scope.handleBeforeUnload == 'true'
                    };

                    $scope.$on('showAjaxLoader', function () {
                        showLoader();
                    });

                    $scope.$on('hideAjaxLoader', function () {
                        hideLoader();
                    });

                    if (settings.handleBeforeUnload) {
                        $window.onbeforeunload = function () {
                            showLoader();
                        };
                    }

                    $scope.getTransition = function () {

                        var opacityDuration = getSecondsString(settings.animationDuration);
                        var opacityDelay = getSecondsString(showIt ? settings.showAfter : settings.hideAfter);
                        var transformDuration = getSecondsString(0);
                        var transformDelay = getSecondsString(showIt ? 0 : settings.showAfter + settings.animationDuration);
                        return 'opacity ' + opacityDuration + ' ' + opacityDelay + ', transform ' + transformDuration + ' ' + transformDelay;

                        function getSecondsString(ms) {
                            return ms / 1000 + 's';
                        }

                    };

                    $scope.getTransform = function () {
                        return showIt ? 'scale(1,1)' : 'scale(0,0)';
                    };

                    $scope.getOpacity = function () {
                        return showIt ? 1 : 0;
                    };

                    function showLoader() {
                        showIt = true;
                    }

                    function hideLoader() {
                        showIt = false;
                    }

                }
            };
        });


    app.config([
        '$httpProvider', function ($httpProvider) {
            $httpProvider.interceptors.push(function ($q, $rootScope) {
                var api = {
                    hideLoaderFunctions: {}
                };

                api.request = function (config) {
                    if (!config.cancelAjaxLoader) {
                        $rootScope.$broadcast('showAjaxLoader');
                        config.ajaxLoaderId = 'Id' + Math.random();
                        api.hideLoaderFunctions = {};
                        api.hideLoaderFunctions[config.ajaxLoaderId] = function () {
                            $rootScope.$broadcast('hideAjaxLoader');
                        };
                    }
                    return config;
                };

                api.requestError = function (rejection) {
                    hideLoader(rejection.config);
                    return $q.reject(rejection);
                };

                api.response = function (response) {
                    hideLoader(response.config);
                    return response;
                };

                api.responseError = function (rejection) {
                    hideLoader(rejection.config);
                    return $q.reject(rejection);
                };

                function hideLoader(config) {
                    if (!config.cancelAjaxLoader && api.hideLoaderFunctions[config.ajaxLoaderId]) {
                        api.hideLoaderFunctions[config.ajaxLoaderId]();
                        delete api.hideLoaderFunctions[config.ajaxLoaderId];
                    }
                }

                return api;
            });
        }
    ]);

})();

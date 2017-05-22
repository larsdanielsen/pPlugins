(function () {
    'use strict';

    var app = angular.module('ajaxLoader', []);

    app.directive('ajaxLoader',
        function () {
            return {
                restrict: 'AE',
                template:
                    '<div ng-style="{ display: display, opacity: opacity, transitionProperty: transitionProperty, transitionTimingFunction: transitionTimingFunction, transitionDuration: transitionDuration }">Loading ...</div>',
                replace: true,
                scope: {
                    showAfter: '=',
                    hideAfter: '=',
                    animationDuration: '=',
                    handleBeforeUnload: '='
                },
                controller: function ($scope, $element, $window, $timeout) {

                    $scope.display = 'none';
                    $scope.opacity = 0;
                    $scope.transitionProperty = 'opacity';
                    $scope.transitionTimingFunction = 'linear';

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

                    $scope.transitionDuration = settings.animationDuration + 'ms';

                    $scope.$on('showAjaxLoader', function () {
                        showLoader($scope, settings);
                    });

                    $scope.$on('hideAjaxLoader', function () {
                        hideLoader($scope, settings);
                    });

                    if (settings.handleBeforeUnload) {
                        $window.onbeforeunload = function () {
                            showLoader($scope, settings);
                        };
                    }

                    $scope.getTransition = function () {
                        return '';
                    };

                    var showLoaderTimeout;
                    var hideLoaderTimeout;

                    function showLoader(scope, settings) {

                        if (settings.showAfter && settings.showAfter > 0) {
                            $timeout.cancel(hideLoaderTimeout);
                            $timeout.cancel(showLoaderTimeout);
                            showLoaderTimeout = $timeout(showLoaderFunction, settings.showAfter);
                        } else {
                            showLoaderFunction();
                        }

                        function showLoaderFunction() {
                            scope.display = 'block';
                            $timeout(function () { scope.opacity = 1; }, 1);
                        }

                    }

                    function hideLoader(scope, settings) {

                        if (settings.hideAfter && settings.hideAfter > 0) {
                            $timeout.cancel(hideLoaderTimeout);
                            $timeout.cancel(showLoaderTimeout);
                            hideLoaderTimeout = $timeout(hideLoaderFunction, settings.hideAfter);
                        } else {
                            hideLoaderFunction();
                        }

                        function hideLoaderFunction() {
                            scope.opacity = 0;
                            $timeout(function () {
                                scope.display = 'none';
                            }, settings.animationDuration);
                        }
                    }

                }
            };
        });

    app.factory('ajaxLoaderInterceptor',
        function ($rootScope) {
            return {
                request: function (config) {
                    if (!config.cancelAjaxLoader) {
                        $rootScope.$broadcast('showAjaxLoader');
                    }
                    return config;
                },
                requestError: function (config) {
                    $rootScope.$broadcast('hideAjaxLoader');
                    return config;
                },
                response: function (config) {
                    $rootScope.$broadcast('hideAjaxLoader');
                    return config;
                },
                responseError: function (config) {
                    $rootScope.$broadcast('hideAjaxLoader');
                    return config;
                }
            };
        });

    app.config([
        '$httpProvider', function ($httpProvider) {
            $httpProvider.interceptors.push('ajaxLoaderInterceptor');
        }
    ]);

})();
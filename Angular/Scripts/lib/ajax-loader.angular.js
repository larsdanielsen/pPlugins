(function () {
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
                controller: function ($scope, $element, $window, $timeout) {

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


/*
    .loader {
  background-color: black;
  color: white;
  padding: 20px;
  box-sizing: border-box;
  
opacity: 0;
transform: scale(0,0);
transition: opacity 1s, transform 0s 2s;
  
  &.visible {
opacity: 1;
transform: scale(1,1);
transition: opacity 2s, transform 0s;
  }
}



*/
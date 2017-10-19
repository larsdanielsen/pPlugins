
var ajaxSpinner = {};
var ajaxSpinnerSettings = {};

(function (api, userSettings) {
    'use strict';
    var spinnerDateRole = 'ajaxSpinnerTag',
        showIt = false;


    var defaultSettings = {
        showAfter: 500,
        hideAfter: 200,
        animationDuration: 300,
        handleBeforeUnload: false
    };

    var settings = {
        showAfter: userSettings.showAfter === undefined ? defaultSettings.showAfter : parseInt(userSettings.showAfter),
        hideAfter: userSettings.hideAfter === undefined ? defaultSettings.hideAfter : parseInt(userSettings.hideAfter),
        animationDuration: userSettings.animationDuration === undefined ? defaultSettings.animationDuration : parseInt(userSettings.animationDuration),
        handleBeforeUnload: userSettings.handleBeforeUnload === undefined ? defaultSettings.handleBeforeUnload : userSettings.handleBeforeUnload == 'true'
    };


    var spinner = $('[data-role=' + spinnerDateRole + ']');

    if (spinner.length == 0){
        spinner = $('<div data-role="' + spinnerDateRole + '" class="ajax-loader">Loading &hellip;</div>');
        spinner.appendTo('body');        
    }


    api.showLoader = function () {
        showIt = true;
        updateDisplay();
    };

    api.hideLoader = function () {
        showIt = false;
        updateDisplay();
    };

    var getTransform = function () {
        return showIt ? 'scale(1,1)' : 'scale(0,0)';
    };

    var getOpacity = function () {
        return showIt ? 1 : 0;
    };

    var getTransition = function () {

        var opacityDuration = getSecondsString(settings.animationDuration);
        var opacityDelay = getSecondsString(showIt ? settings.showAfter : settings.hideAfter);
        var transformDuration = getSecondsString(0);
        var transformDelay = getSecondsString(showIt ? 0 : settings.showAfter + settings.animationDuration);
        return 'opacity ' + opacityDuration + ' ' + opacityDelay + ', transform ' + transformDuration + ' ' + transformDelay;

        function getSecondsString(ms) {
            return ms / 1000 + 's';
        }

    };

    var updateDisplay = function () {
        spinner.css({
            transform: getTransform(),
            opacity: getOpacity(),
            transition: getTransition()
        });
    }

    window.onbeforeunload = function () {
        api.showLoader();
    };

    /*

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
                    hideLoaderFunctions: []
                };

                api.request = function (config) {
                    //console.log(config);
                    if (!config.cancelAjaxLoader) {
                        $rootScope.$broadcast('showAjaxLoader');
                        config.ajaxLoaderId = Math.random();
                        api.hideLoaderFunctions.push({
                            id: config.ajaxLoaderId,
                            func: function () { $rootScope.$broadcast('hideAjaxLoader'); }
                        });
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
                    if (!config.cancelAjaxLoader) {
                        for (var i = 0; i < api.hideLoaderFunctions.length; i++) {
                            //console.log(api.hideLoaderFunctions[i]);
                            //console.log(config.ajaxLoaderId);
                            if (api.hideLoaderFunctions[i].id == config.ajaxLoaderId) {
                                if (api.hideLoaderFunctions.length == 1) {
                                    api.hideLoaderFunctions[i].func();
                                }
                                api.hideLoaderFunctions.splice(i, 1);
                                break;
                            }
                        }
                    }
                }

                return api;
            });
        }
    ]);
    */
})(ajaxSpinner, ajaxSpinnerSettings);

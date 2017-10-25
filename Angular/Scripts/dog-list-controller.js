﻿(function (root) {
    'use strict';

    var app = root.getModule();

    app.controller('dogListController', function ($scope, $rootScope, $timeout, $log, dogService) {
        
        $scope.getData = function (delay, silent, ignoreResult) {
            $scope.dogs = null;
            dogService.getData(delay, silent).then(function (response) {
                console.log('getData done');
                if (!ignoreResult) {
                    $scope.dogs = response.data;
                }
                console.log($scope.dogs);
                //$scope.showLoader();
            });
        };

        $scope.overlappingRequests = function () {
            $scope.getData(4000);
            $scope.getData(1000, false, true);
        };

        $scope.showLoader = function () {
            $rootScope.$broadcast('showAjaxLoader');
        };

        $scope.hideLoader = function () {
            $rootScope.$broadcast('hideAjaxLoader');
        };

        $scope.clearCache = function () {
            dogService.saveDog();
        };

        $scope.$on('onLastRepeat', function (scope, element, attrs) {
            $timeout(bLazyRevalidate, 0);
        });

        function bLazyRevalidate() {
            root.bLazy.revalidate();
        };


        $scope.jsonDateToDate = function (json) {
            var i = parseInt(json.match(/\d+/g));
            return new Date(i);
        };

    });
})(MyAppSettings || (MyAppSettings = {}));
(function (root) {
	'use strict';

	var app = root.getModule();

	app.controller('dogListController', function ($scope, $rootScope, $timeout, $log, dogService) {
	    $scope.getData = function (delay, silent) {
	        $scope.dogs = null;
	        dogService.getData(delay, silent).then(function (response) {
	            $log.info(response);
	            $scope.dogs = response.data;
	            //$scope.showLoader();
	        });
	    };
	    $scope.showLoader = function () {
	        $rootScope.$broadcast('showAjaxLoader');
	    };
	    $scope.hideLoader = function () {
	        $rootScope.$broadcast('hideAjaxLoader');
	    };

	    $scope.$on('onLastRepeat', function (scope, element, attrs) {
	        console.log('Last dog loaded');
	        //$timeout($scope.hideLoader, 400);
	    });

	});
})(MyAppSettings || (MyAppSettings = {}));
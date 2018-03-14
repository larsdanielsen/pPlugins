(function (root) {
    'use strict';

    var app = root.getModule();

    app.controller('dogListController', function ($scope, $rootScope, $timeout, $log, dogService) {

        $scope.getData = function (delay, silent, ignoreResult) {
            $scope.dogs = null;
            dogService.getData(delay, silent).then(function (response) {
                console.log('getData done');
                if (!ignoreResult) {
                    $scope.dogs = response.data;
                  $timeout(initIsotope, 100);
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

        var $grid;

        $scope.filterBorn = function () {
            console.log($grid);
            $grid.isotope({
                sortBy: 'born'
            });
        };

        $scope.selectDog = function (selectedDog) {
            $scope.selectedDog = angular.copy(selectedDog);
            $scope.ddSelectedDog = null;
        };


        function initIsotope() {
            console.log('initIsotope');

            $grid = $('.dogs-list').isotope({
                itemSelector: '.dog',
                layoutMode: 'fitRows',
                getSortData: {
                //    name: '.name',
                //    symbol: '.symbol',
                //    number: '.number parseInt',
                //    category: '[data-category]',
                    born: '.born'
                },
                sortBy: 'born'
            });

            $timeout(bLazyRevalidate, 0);


            $grid.on('layoutComplete',
                function (event, laidOutItems) {
                    console.log('Isotope layout completed on ' +
                        laidOutItems.length + ' items');
                    $timeout(bLazyRevalidate, 0);
                }
            );

            // filter functions
            var filterFns = {
                // show if number is greater than 50
                numberGreaterThan50: function () {
                    var number = $(this).find('.number').text();
                    return parseInt(number, 10) > 50;
                },
                // show if name ends with -ium
                ium: function () {
                    var name = $(this).find('.name').text();
                    return name.match(/ium$/);
                }
            };

            // bind filter button click
            $('#filters').on('click', 'button', function () {
                var filterValue = $(this).attr('data-filter');
                // use filterFn if matches value
                filterValue = filterFns[filterValue] || filterValue;
                $grid.isotope({ filter: filterValue });
            });

            // bind sort button click
            $('#sorts').on('click', 'button', function () {
                var sortByValue = $(this).attr('data-sort-by');
                $grid.isotope({ sortBy: sortByValue });
            });

            // change is-checked class on buttons
            $('.button-group').each(function (i, buttonGroup) {
                var $buttonGroup = $(buttonGroup);
                $buttonGroup.on('click', 'button', function () {
                    $buttonGroup.find('.is-checked').removeClass('is-checked');
                    $(this).addClass('is-checked');
                });
            });


        }
        


    });
})(MyAppSettings || (MyAppSettings = {}));
(function (root) {
    'use strict';

    var app = root.getModule();

    app.factory('dogService', function ($http) {

        var api = {}
        var defaultApiEndpoint = '/DogService.asmx';

        api.getData = function (delay, silent) {
            return $http({
                method: 'GET',
                url: defaultApiEndpoint + '/GetData',
                params: { delay: delay || 0},
                cancelAjaxLoader: !!silent
            });
        };

        return api;
    });
})(MyAppSettings || (MyAppSettings = {}));
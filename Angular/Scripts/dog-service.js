(function (root) {
    'use strict';

    var app = root.getModule();

    app.factory('dogService', function ($http, $cacheFactory) {

        var api = {}
        var defaultApiEndpoint = '/DogService.asmx';
        var dogServiceCache = $cacheFactory('dogServiceCache');

        api.getData = function (delay, silent) {
            return $http({
                method: 'GET',
                url: defaultApiEndpoint + '/GetData',
                params: { delay: delay || 0 },
                cache: dogServiceCache,
                cancelAjaxLoader: !!silent
            });
        };

        api.saveDog = function () {
            dogServiceCache.removeAll();
        };

        return api;
    });
})(MyAppSettings || (MyAppSettings = {}));
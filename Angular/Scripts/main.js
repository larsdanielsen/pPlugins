var MyAppSettings;
(function (root) {
    'use strict';

    angular.module('myApp', ['ajaxLoader', 'onLastRepeat']);
    
    root.getModule = function () {
        return angular.module('myApp');
    };

    root.bLazy = new Blazy({
        src: 'data-blazy' // Default is data-src
    });

})(MyAppSettings || (MyAppSettings = {}));

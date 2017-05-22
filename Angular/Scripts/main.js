var MyAppSettings;
(function (root) {
    'use strict';

    angular.module('myApp', ['ajaxLoader', 'onLastRepeat']);
    
    root.getModule = function () {
        return angular.module('myApp');
    };

})(MyAppSettings || (MyAppSettings = {}));
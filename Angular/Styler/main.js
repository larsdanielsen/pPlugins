///

var MyStylerAppSettings;
(function (root) {
    'use strict';

    var app = angular.module('myStylerApp', []);
    
    root.getModule = function () {
        return angular.module('myStylerApp');
    };

    //app.constant('mixinNames', {
    //    Color: 'Color',
    //    BackgroundColor: 'BackgroundColor',
    //    Gradient: 'Gradient'
    //});

})(MyStylerAppSettings || (MyStylerAppSettings = {}));

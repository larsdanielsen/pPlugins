(function (root) {
    'use strict';

    var app = root.getModule();

    app.factory('editorFactory',
        function () {
            var api = {};
            api.mixinNames = {
                Color: 'Color',
                BackgroundColor: 'BackgroundColor',
                Gradient: 'Gradient',
                Rounded: 'Rounded'
            };
            return api;
            
        });
})(MyStylerAppSettings || (MyStylerAppSettings = {}));
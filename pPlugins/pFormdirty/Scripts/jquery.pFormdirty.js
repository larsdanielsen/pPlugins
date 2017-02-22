/*
pFormdirty plugin
Author: Lars Danielsen

Checks if a form is dirty

Required: jQuery

Synopsis:


It will:

-   xx

-   xx

options:
xx:                        xx.

*/


jQuery.fn.pFormdirty = function (init) {
    var defaults = {
    };

    return this.each(function () {
        var options = jQuery.extend(defaults, init);
        var forms = jQuery(this);
        handleFormDirty(forms, options);
    });


    function handleFormDirty(forms, options) {

        if (!forms) {
            forms = $('form').not('[data-formdirty-ignore=yes]');
        }
        if (forms) {
            forms.each(function () {
                var form = $(this);
                var serializedData = formSerializeSorted($(this));
                if (form.data('formdirty-forcedirty')) {
                    serializedData = '';
                }
                form.data('serializedData', serializedData);
                form.off('.formdirty').on('submit.formdirty', function () {
                    $(this).data('submitInProgress', true);
                });
            });
        }

// ReSharper disable once UnusedParameter
        window.onbeforeunload = function (e) {
            if (hasUnsavedChanges($('form').not('[data-formdirty-ignore=yes]')))
                return 'UnsavedDataWarning';
            return undefined;
        };

    }


    function formSerializeSorted(form) {
        var formObject = sortObject(deSerialize($(form).formSerialize()));

        delete formObject['__RequestVerificationToken'];

        $(form).find('[data-ignore-dirty=yes]').each(function () {
            delete formObject[$(this).attr('name')];
        });


        $(form).find('input[type=checkbox], input[type=radio]').each(function () {
            var checkbox = $(this);
            var allInGroup = $(form).find('input[type=checkbox][name="' + $(this).attr('name') + '"],input[type=radio][name="' + $(this).attr('name') + '"]');
            var vals = [];
            allInGroup.each(function () {
                var cb = $(this);
                if (cb.prop('checked')) {
                    vals.push(cb.val());
                }
            });
            formObject[checkbox.attr('name')] = vals.join(',');
        });

        return JSON.stringify(formObject);

        function deSerialize(strData) {
            var data = {};
            $.each(strData.split('&'), function (key, value) {
                var item = value.split('=');
                data[item[0]] = item[1];
            });
            return data;
        }

        function sortObject(obj) {
            return Object.keys(obj).sort().reduce(function (result, key) {
                result[key] = obj[key];
                return result;
            }, {});
        }

    }


    function hasUnsavedChanges(forms, ignoreSubmitInProgress) {
        var unsavedchanges = false;
        forms.each(function () {
            var form = $(this);
            if (ignoreSubmitInProgress || !form.data('submitInProgress')) {
                var serializedFormData = form.data('serializedData');

                if (serializedFormData) {

                    var savedData = serializedFormData;
                    var nowData = formSerializeSorted(form);

                    if (savedData != nowData) {
                        unsavedchanges = true;
                    }

                }
            }
        });

        return unsavedchanges;
    }


};

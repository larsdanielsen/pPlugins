$(document).ready(function () {

    $('[data-action=remove]').click(function () {
        $('select.doit').pSelect('remove');
    });
    $('[data-action=run]').click(function () {
        $('select.doit').pSelect();
    });
    $('select.doit').pSelect();

    $('body').on('change.checkboxConfirm', '[data-checkbox-confirm]', function (e) {

        var checkbox = $(this);
        if (checkbox.prop('checked')) {
            checkbox.prop('checked', false);
            checkbox.prop('checked', window.confirm(checkbox.data('checkbox-confirm')));
        }

    });

    $('body').on('change.myNameSpace', 'select.doit', function (e) {
        $('#email').val($(this).val());
    });



});
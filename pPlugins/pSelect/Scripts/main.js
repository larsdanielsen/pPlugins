$(document).ready(function () {
    //var runOnInit = true;

    var options = {
        summeyText: '# of % selected',
        labelIfNoneSelected: 'Please select here ...',
        summeyIfMoreThan: 3
    };

    $('[data-action=remove]').click(function () {
        $('select.doit').pSelect('remove');
    });
    $('[data-action=runAutoComplete]').click(function () {
        options.autoComplete = true;
        $('select.doit').pSelect(options);
    });
    $('[data-action=run]').click(function () {
        $('select.doit').pSelect(options);
    });
    //if (runOnInit) $('select.doit').pSelect();
    $('[data-action=run]').trigger('click');

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
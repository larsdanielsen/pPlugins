$(document).ready(function () {
    var runOnInit = true;

    $('[data-action=remove]').click(function () {
        $('select.doit').pSelect('remove');
    });
    $('[data-action=runAutoComplete]').click(function () {
        $('select.doit').pSelect({ autoComplete: true });
    });
    $('[data-action=run]').click(function () {
        $('select.doit').pSelect();
    });
    if (runOnInit) $('select.doit').pSelect();

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

    var bootstrapCss = $('link[data-type=bootstrap]');
    var genericCss = $('link[data-type=generic]');
    $('body').on('click.styling', '[data-role=BootstrapCss]', function (e) {
        if ($(this).prop('checked')) {
            bootstrapCss.insertAfter('head title:first');
            genericCss.detach();
        } else {
            genericCss.insertAfter('head title:first');
            bootstrapCss.detach();
        }
    });

    setBootstrap(true);

    function setBootstrap(show) {
        $('[data-role=BootstrapCss]').prop('checked', show).trigger('click.styling');
    }

});
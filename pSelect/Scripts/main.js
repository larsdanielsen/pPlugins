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

    var bootstrapCss = $('link[data-theme=bootstrap]');
    var simpleCss = $('link[data-theme=simple]');
    $('body').on('click.styling', 'input[name=theme]', function (e) {
        var theme = $(this).data('theme');
        $('body').fadeOut(10, function() {
             if (theme == 'bootstrap') {
            bootstrapCss.insertAfter('link[data-type=base]');
            simpleCss.detach();
        } else if (theme == 'simple') {
            simpleCss.insertAfter('link[data-type=base]');
            bootstrapCss.detach();
        }
        }).fadeIn();
    });

    setBootstrap(true);

    function setBootstrap(show) {
        $('input[name=theme]').first().prop('checked', show).trigger('click.styling');
    }

});
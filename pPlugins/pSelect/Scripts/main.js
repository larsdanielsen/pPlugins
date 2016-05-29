$(document).ready(function () {
    var runOnInit = true;

    var options = {
        summeyText: '# of % selected',
        labelIfNoneSelected: 'Please select here ...',
        summeyIfMoreThan: 3,
        Animate: function($ul, ulCss) {
            $ul.css({maxHeight: 0, overflow: 'hidden'});
            $ul.show();
            window.setTimeout(function () { $ul.css(ulCss); }, 0);
            window.setTimeout(function () { $ul.css({ overflowY: 'auto' }); }, 100);
            
        }
    };

    $('[data-action=remove]').click(function () {
        $('select.doit').pSelect('remove');
    });
    $('[data-action=runAutoComplete]').click(function () {
        options.autoComplete = true;
        $('select.doit').pSelect(options);
    });
    $('[data-action=run]').click(function () {
        options.autoComplete = false;
        $('select.doit').pSelect(options);
    });

// ReSharper disable once ConditionIsAlwaysConst
    if (runOnInit) $('[data-action=run]').trigger('click');

    $('body').on('change.checkboxConfirm', '[data-checkbox-confirm]', function (e) {

        var checkbox = $(this);
        if (checkbox.prop('checked')) {
            checkbox.prop('checked', false);
            checkbox.prop('checked', window.confirm(checkbox.data('checkbox-confirm')));
        }

    });

    $('body').on('change.myNameSpace', 'select.doit', function (e) {
        $('[data-role=DisplayValue]').text($(this).val());
    });




});
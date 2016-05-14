$(document).ready(function () {
    
    //$('input').not('.native').pCheckRadio();

    $('[data-action=remove]').click(function () {
        $('input:checkbox').pCheckRadio('remove');
    });
    $('[data-action=run]').click(function () {
        $('input:checkbox').pCheckRadio();
    });
    //if (runOnInit) $('select.doit').pSelect();
    $('[data-action=run]').trigger('click');
    
    var bootstrapCss = $('link[data-theme=bootstrap]');
    var simpleCss = $('link[data-theme=simple]');
    $('body').on('click.styling', 'input[name=theme]', function (e) {
        var theme = $(this).data('theme');
        $('body').fadeOut(10, function () {
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
        $('input[name=theme]').first().prop('checked', show).trigger('change.pCheckRadio').trigger('click.styling');
    }
    
   
});
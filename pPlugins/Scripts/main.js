$(document).ready(function () {
    
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

    setTheme(1);

    function setTheme(i) {
        $($('input[name=theme]').get(i)).prop('checked', true).trigger('change.pCheckRadio').trigger('click.styling');
    }
   
});
$(document).ready(function () {
    
    var bootstrapCss = $('link[data-theme=bootstrap]');
    var simpleCss = $('link[data-theme=simple]');
    $('body').on('click.styling', 'input[name=theme]', function (e) {
        var theme = $(this).data('theme');
        setCookie('themeIndex', theme);
        $('body').fadeOut(10, function () {
            if (theme == 'bootstrap') {
                bootstrapCss.insertAfter('[data-type=base]');
                simpleCss.detach();
            } else if (theme == 'simple') {
                simpleCss.insertAfter('[data-type=base]');
                bootstrapCss.detach();
            }
        }).fadeIn();
    });

    var theme = getCookie('themeIndex') || 'bootstrap';
    setTheme(theme);

    function setTheme(i) {
        $('input[name=theme][data-theme=' + theme + ']').prop('checked', true).trigger('change.pCheckRadio').trigger('click.styling');
    }
   
});

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires + "; path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
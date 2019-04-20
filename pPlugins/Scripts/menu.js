;
(function ($) {
    var topNav = $('[data-role=TopNav]');
    var menu = [];
    menu.push({ title: 'pSelect', url: '/pSelect/' });
    menu.push({ title: 'pCheckRadio', url: '/pCheckRadio/' });
    menu.push({ title: 'pFigure', url: '/pFigure/' });
    menu.push({ title: 'pFormdirty', url: '/pFormdirty/' });
    menu.push({ title: 'pHashHandler', url: '/pHashHandler/' });
    menu.push({ title: 'AjaxLoader', url: '/AjaxLoader/' });
    menu.push({ title: 'AnimatedGrid', url: '/AnimatedGrid/' });

    topNav.empty();

    for (var i = 0; i < menu.length; i++) {
        var li = $('<li/>')
            .append($('<a/>').text(menu[i].title).attr('href', menu[i].url));
        topNav.append(li);
    }

})(jQuery);
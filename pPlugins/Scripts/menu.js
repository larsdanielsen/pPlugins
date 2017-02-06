;
(function ($) {
    var topNav = $('[data-role=TopNav]');
    var menu = [];
    menu.push({ title: 'pSelect', url: 'pSelect/default.htm' });
    menu.push({ title: 'pCheckRadio', url: 'pCheckRadio/default.htm' });
    menu.push({ title: 'pFigure', url: 'pFigure/default.htm' });
    menu.push({ title: 'pHashHandler', url: 'pHashHandler/default.htm' });

    topNav.empty();

    for (var i = 0; i < menu.length; i++) {
        var li = $('<li/>')
            .append($('<a/>').text(menu[i].title).attr('href', menu[i].url));
        topNav.append(li);
    }

})(jQuery);
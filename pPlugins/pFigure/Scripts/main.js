(function () {


    var htmlTextarea = $('[data-html]');
    var initial = initValue(htmlTextarea.val());
    htmlTextarea.val(initial);

    $('[data-action=remove]').click(function () {
        initFigure('body', true);
    });
    $('[data-action=run]').click(function () {
        initFigure('body');
    });
    $('[data-action=reset]').click(function () {
        htmlTextarea.val(initial);
        initFigure('body');
    });

    $('[data-action=run]').trigger('click');

    function initValue(str) {
        var spaces = str.match(/^\s*/g);
        if (spaces && spaces[0] && spaces[0].length) {
            var cleanupRx = new RegExp('^\\s{' + spaces[0].length + '}', 'mg');
            return str.replace(cleanupRx, '');
        }
        return str;
    }

    function initFigure(selector, remove) {
        if ($.fn.figure) {
            $(selector)
                .find('[data-richtext]')
                .html(htmlTextarea.val());
            if (!remove) {
                $(selector)
                    .find('[data-richtext]')
                    .figure({
                        figureClass: 'figure img-holder visible-xs-inline-block visible-sm-inline-block visible-md-inline-block visible-lg-inline-block',
                        transferImgClassNamesToFigureStyle: false

                    });
            }
        }
    }

})();





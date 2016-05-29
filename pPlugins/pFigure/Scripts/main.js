(function () {


    $('[data-action=remove]').click(function () {
        initFigure('body', true);
    });
    $('[data-action=run]').click(function () {
        initFigure('body');
    });

    $('[data-action=run]').trigger('click');

    
    function initFigure(selector, remove) {
        if ($.fn.figure) {
            $(selector)
                .find('[data-richtext]')
                .html($('[data-html]').val());
            if (!remove) {
                $(selector)
                    .find('[data-richtext]')
                    .figure({
                        figureClass: 'img-holder visible-xs-inline-block visible-sm-inline-block visible-md-inline-block visible-lg-inline-block',
                        transferImgClassNamesToFigureStyle: false
                    });
            }
        }
    }

})();





(function () {

    initFigure('body');

    function initFigure(selector) {
        if ($.fn.figure) {

            $(selector).find('[data-richtext]').figure({
                figureClass: 'img-holder visible-md visible-lg',
                transferImgClassNamesToFigureStyle: false
            });
        }
    }

})();





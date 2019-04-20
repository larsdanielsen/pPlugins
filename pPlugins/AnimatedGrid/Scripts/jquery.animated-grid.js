var animationDuration = 1000;


function fixGrid(wrapper, ident) {
    if (wrapper.data('saved-style') === undefined) {
        console.log('saving initial styles');
        wrapper.data('saved-style', wrapper.attr('style') || '');
        wrapper.find('> *').each(function () {
            var item = $(this);
            item.data('saved-style', item.attr('style') || '');
        });
    }


    if (!ident) {
        ident = 'initial-dimensions';
        saveCurrentDimensions(wrapper, ident);
    }
    var dimensions = wrapper.data(ident);
    wrapper.css({
        position: 'relative',
        boxSizing: 'border-box',
        transitionProperty: 'width, height, top, left',
        transitionDuration: animationDuration +'ms',
        width: dimensions.width,
        height: dimensions.height
    });

    wrapper.find('> *').each(function () {
        var item = $(this);
        var itemDimensions = item.data(ident);
        item.css({
            position: 'absolute',
            boxSizing: 'border-box',
            transitionProperty: 'width, height, top, left',
            transitionDuration: animationDuration + 'ms',
            width: itemDimensions.width,
            height: itemDimensions.height,
            top: itemDimensions.top,
            left: itemDimensions.left
        });
    });
}

function releaseGrid(wrapper) {

    wrapper.attr('style', wrapper.data('saved-style') || '');
    wrapper.find('> *').each(function () {
        var item = $(this);
        item.attr('style', item.data('saved-style') || '');
    });

}

function animateGrid(wrapper, func) {
    releaseGrid(wrapper);
    if (func) {
        func(wrapper);
    }
    saveCurrentDimensions(wrapper, 'end-dimensions');
    fixGrid(wrapper, 'initial-dimensions');
    window.setTimeout(() => {
        fixGrid(wrapper, 'end-dimensions');
        window.setTimeout(() => {
                releaseGrid(wrapper);
            },
            animationDuration * 2);
    }, 10);

}

function saveCurrentDimensions(wrapper, ident) {
    wrapper.data(ident, {
        width: wrapper.outerWidth() + 'px',
        height: wrapper.outerHeight() + 'px'
    });
    var gridOffset = wrapper.offset();
    wrapper.find('> *').each(function () {
        var item = $(this);
        var w = item.outerWidth();
        var h = item.outerHeight();
        var o = item.offset();
        var t = o.top - gridOffset.top;
        var l = o.left - gridOffset.left;

        item.data(ident, {
            width: w + 'px',
            height: h + 'px',
            top: t + 'px',
            left: l + 'px'
        });
    });
}
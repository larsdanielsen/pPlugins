$('#Sort').click(() => {
    fixGrid($('.my-grid'));
    resizeTimeout = window.setTimeout(() => {
        animateGrid($('.my-grid'), sortRandom);
    }, 200);
});

$('#SortOnly').click(() => {
    sortRandom($('.my-grid-2'));
});


var resizeTimeout = 0;
$(window).resize(function () {
    window.clearTimeout(resizeTimeout);
    fixGrid($('.my-grid'));
    resizeTimeout = window.setTimeout(() => {
        animateGrid($('.my-grid'));
    }, 500);
});


function sortRandom(wrapper) {
    var count = wrapper.children().length;
    console.log(count);

    var elemIndex = Math.floor(Math.random() * count);
    var endIndex = Math.floor(Math.random() * count);
    console.log(elemIndex);
    console.log(endIndex);

    var elem = wrapper.children().get(elemIndex);
    $(elem).insertAfter(wrapper.children().get(endIndex));
}
$(document).ready(function () {
    $('.my-grid').animatedGrid({ handleResize: false });
});

$('#Sort').click(() => {
    //sortRandom($('.my-grid'));
    switchTwo($('.my-grid'));
    //removeOne($('.my-grid'), 0);

    //$('.my-grid').animatedGrid('fix');
    //resizeTimeout = window.setTimeout(() => {
    //    $('.my-grid').animatedGrid('animate', sortRandom);
    //}, 200);
});

function removeOne(wrapper, i) {
    wrapper.children().eq(i).remove();
}
function switchTwo(wrapper) {
    wrapper.children().eq(0).insertAfter(wrapper.children().eq(1));
}

function sortRandom(wrapper) {
    var count = wrapper.children().length;
    //console.log(count);
    for (var i = 0; i < count; i++) {

        var elemIndex = Math.floor(Math.random() * count);
        var endIndex = Math.floor(Math.random() * count);
        //console.log(elemIndex);
        //console.log(endIndex);

        var elem = wrapper.children().get(elemIndex);
        $(elem).insertAfter(wrapper.children().get(endIndex));
    }
}

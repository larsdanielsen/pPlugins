(function () {

    $('[data-action=remove]').click(function () {
        initFormdirty('body', true);
    });
    $('[data-action=run]').click(function () {
        initFormdirty('form');
    });

    $('[data-action=run]').trigger('click');

    function initFormdirty(selector, remove) {
        $(selector).pFormdirty({remove: remove});
    }

})();





$(document).ready(function () {
    
    //$('input').not('.native').pCheckRadio();

    $('[data-action=remove]').click(function () {
        $('input:checkbox, input:radio').pCheckRadio('remove');
    });
    $('[data-action=run]').click(function () {
        $('input:checkbox, input:radio').pCheckRadio();
    });

    //$('[data-action=run]').trigger('click');
   
});
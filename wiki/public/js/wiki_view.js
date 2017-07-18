/**
 * Created by Le Reveur on 2017-07-18.
 */
$(function(){
    $('.wiki-syntaxhl code').each(function(i, elem){Prism.highlightElement(elem)});
    $('#btn_etc').click(function () {
        $('#modal_etc').modal('show');
    })
});
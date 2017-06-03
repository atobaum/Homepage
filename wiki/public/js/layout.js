/**
 * Created by Le Reveur on 2017-05-12.
 */

$(function(){
   $('input.prompt')
       .keypress(function(evt){
       if (event.which == 13 || event.keyCode == 13) {
           window.location.href = "/wiki/view/"+encodeURIComponent($('input.prompt').val());
       }
   });
   $('.ui.search').search({
       apiSettings: {
           url: '/wiki/api/titleSearch?q={query}'
       },
       fields: {
           results : 'result'
       },
       onSelect: function(result){
           window.location.href = "/wiki/view/"+encodeURIComponent(result.title);
       },
       searchDelay: 500
   });

});

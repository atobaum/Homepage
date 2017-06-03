/**
 * Created by Le Reveur on 2017-05-12.
 */

function formatTitle(title){
    var parsedTitle = /(?:^(.*?):)?(.*?)$/.exec(title);
    parsedTitle[2] = parsedTitle[2] || "Index";
    return (parsedTitle[1] ? parsedTitle[1]+":" : "") + parsedTitle[2];
}

$(function(){
   $('input.prompt')
       .keypress(function(evt){
       if (event.which == 13 || event.keyCode == 13) {
           window.location.href = "/wiki/view/"+encodeURIComponent(formatTitle($('input.prompt').val()));
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
           window.location.href = "/wiki/view/"+encodeURIComponent(formatTitle(result.title));
       },
       searchDelay: 500
   });

});

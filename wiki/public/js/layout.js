/**
 * Created by Le Reveur on 2017-05-12.
 */
var content = [

    { title: 'Andorra' },
    { title: 'United Arab Emirates' },
    { title: 'Afghanistan' },
    { title: 'Antigua' },
    { title: 'Anguilla' },
    { title: 'Albania' },
    { title: 'Armenia' },
    { title: 'Netherlands Antilles' },
    { title: 'Angola' },
    { title: 'Argentina' },
    { title: 'American Samoa' },
    { title: 'Austria' },
    { title: 'Australia' },
    { title: 'Aruba' },
    { title: 'Aland Islands' },
    { title: 'Azerbaijan' },
    { title: 'Bosnia' },
    { title: 'Barbados' },
    { title: 'Bangladesh' },
    { title: 'Belgium' },
    { title: 'Burkina Faso' },
    { title: 'Bulgaria' },
    { title: 'Bahrain' },
    { title: 'Burundi' }
    // etc
];

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

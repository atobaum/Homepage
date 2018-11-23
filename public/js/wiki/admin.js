/**
 * Created by Le Reveur on 2017-07-16.
 */
$(function(){
    "use strict";
    $('#btn_clear_cache').click(function(){
        $.get(
            '/wiki/api/admin?action=clear_cache', function(data, status){
                if(data.ok) alert('Cache cleared.');
                else alert('Error occurred: '+data.error);
            });
    })
});

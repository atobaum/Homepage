/**
 * Created by Le Reveur on 2017-05-20.
 */

function login(){
    $.get(
        "/api/auth/login",
        {
            id: $('#login_id').val(),
            password: $('#login_passwd').val(),
            autoLogin: $('#login_auto').parent().checkbox('is checked')
        },
        function(result){
            switch(result.ok){
                case 0:
                    $('#login_id').parent().addClass('error');
                    $('#login_passwd').parent().addClass('error');
                    break;
                case 1:
                    window.location.replace(document.referrer);
                    break;
                case 2:
                    $('#login_id').parent().removeClass('error');
                    $('#login_passwd').parent().addClass('error');
                    break;
            }
        }
    );
    return false;
}
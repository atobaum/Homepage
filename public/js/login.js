function login(){return $.get("/api/auth/login",{id:$("#login_id").val(),password:$("#login_passwd").val(),autoLogin:$("#login_auto").parent().checkbox("is checked")},function(a){switch(a.ok){case 0:$("#login_id").parent().addClass("error"),$("#login_passwd").parent().addClass("error");break;case 1:window.location.replace(document.referrer);break;case 2:$("#login_id").parent().removeClass("error"),$("#login_passwd").parent().addClass("error")}}),!1}
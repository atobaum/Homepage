/**
 * Created by Le Reveur on 2017-07-18.
 */
"use strick";
$(function(){
    var wiki_title = $("meta[name='wiki_title']").attr('content');
    $('.wiki-syntaxhl code').each(function(i, elem){Prism.highlightElement(elem)});
    $('#btn_etc').click(function () {
        $('#modal_etc').modal('show');
    });

    $('#btn_clear_cache').click(function () {
        $.get({
            url: '/wiki/api/admin',
            data: {
                action: 'clearCache',
                title: wiki_title
            },
            success: function (res) {
                "use strict";
                if (res.ok) {
                    alert('Success clearing cache');
                }
                else {
                    alert('Fail clearing cache.');
                    console.log('Error' + res.error.message);
                }
            },
            error: function (xhr, status, error) {
                console.log(xhr.responseText);
            }
        });
    });

    $('#btn_change_title').click(function () {
        var newTitle = prompt("새 제목을 입력하세요.");
        if (newTitle) {
            $.get({
                url: '/wiki/api/admin',
                data: {
                    action: 'changeTitle',
                    title: wiki_title,
                    newTitle: newTitle
                },
                success: function (res) {
                    if (res.ok) {
                        window.location = '/wiki/view/' + res.title + '?updateCache';
                    } else {
                        console.log('Error' + res.error);
                        alert('제목 바꾸기 실패');
                    }
                },
                error: function (xhr, status, error) {
                    console.log(xhr.responseText);
                }
            });
        }
    });

    $('#btn_change_ac').click(function () {
        $.get({
            url: '/api/wiki/admin',
            data: {
                action: 'getPAC',
                title: wiki_title,
            },
            success: function (res) {
                if (res.ok) {
                    let newPAC = prompt(`Current PAC of this page, '${wiki_title}' is ${res.result}`);
                    if(0 > newPAC || 32 <= newPAC){
                        alert("PAC는 0에서 31까지...");
                        return;
                    }

                    $.get({
                        url: "/api/wiki/admin",
                        data: {
                            action: 'setPAC',
                            title: wiki_title,
                            pac: newPAC
                        },
                        success: function (res) {
                            if (res.ok) {
                                alert("성공");
                            } else {
                                alert("실패");
                                console.log(res);
                            }
                        },
                        error: function (res) {
                            alert(res.error);
                        }
                    });
                }else{
                    alert(res.error);
                }
            },
            error: function (xhr, status, error) {
                console.log(xhr.responseText);
            }
        });
    });

    $('.wiki_fn').popup({
        hoverable: true
    });
});
"use strict";
let bookPanel;
function manualSelectBook(){
    for(var i = 0; i < authors.length; i++){
        delete authors[i].text;
    }
    var book = {};
    //language=JQuery-CSS
    var form = $('#manual_book_form');
    book.title = form.find('input[name="title"]').val();
    book.publisher = form.find('input[name="publisher"]').val();
    book.published_date = form.find('input[name="published_date"]').val();
    var isbn = form.find('input[name="isbn"]').val();
    book.isbn13 = (isbn.length === 10) ? '978'+isbn : isbn;
    book.cover_URL = form.find('input[name="cover_URL"]').val();
    book.subtitle = form.find('input[name="subtitle"]').val();
    book.original_title = form.find('input[name="original_title"]').val();
    book.pages = form.find('input[name="pages"]').val();
    book.authors = authors;

    setBook(book);
    $('.modal').modal('hide');
    return false;
}

function resetBook(){
    $('#form_isbn13').val('');
    $('#form_book').val('');
    bookPanel.show = false;
    $('#btns_add_book').show();
}

function openManualBookForm(book, error){
    authors = [];
    var form = $('#manual_book_form');

    //setting message box
    if(error){
        var messageBox = form.parent().find('.ui.message');
        messageBox.addClass('negative');
        messageBox.find('.header').text(error.head);
        messageBox.find('p').text(error.content);
        messageBox.show();
    }

    //setting input text
    if(book) {
        form.find('input[name="title"]').val(book.title);
        form.find('input[name="publisher"]').val(book.publisher);
        form.find('input[name="published_date"]').val(book.published_date);
        form.find('input[name="isbn"]').val(book.isbn13);
        form.find('input[name="cover_URL"]').val(book.cover_URL);
        form.find('input[name="original_title"]').val(book.original_title);
        form.find('input[name="pages"]').val(book.pages);
    }

    $('#manual_author_type').dropdown('clear');
    $('#manual_author_type').dropdown('set selected', 1);
    $('.modal.small').modal('show');
    //$('#manual_author_type').dropdown('set selected', 1);
}

function selectBook(book){
    // $.ajax({
    //     url: '/bookshelf/api/bookinfo/aladin?isbn13='+book.isbn13,
    //     dataType: 'json',
    //     success: function(data){
    //         if(data.ok === 0){
    //             console.log('error: ', data.error);
    //             openManualBookForm(book, {head: '책 자동 추가 실패.', content: "책정보를 수동으로 입력해주세요."});
    //             return;
    //         }
    //         book = data.result;
    //         if(book.authors){
    //             setBook(book);
    //         } else{ //need manual adding
    //             openManualBookForm(book, {head: '책 자동 추가 실패. 저자를 수동으로 추가해주세요.', content: "저자: " + book.authorsText});
    //         }
    //     },
    //     error:()=>{
    //         openManualBookForm(book, {head: '책 자동 추가 실패. 저자를 수동으로 추가해주세요.', content: "저자: " + book.authorsText});
    //
    //     }
    // });
}

function setBook(book){
    bookPanel.isbn13 = book.isbn13;
    bookPanel.coverURL = book.coverURL;
    bookPanel.title = book.title;
    bookPanel.publisher = book.publisher;
    bookPanel.publishedDate = book.publishedDate;
    bookPanel.strAuthors = book.strAuthors;
    bookPanel.show = true;
    $('#form_book').val(JSON.stringify(book));
    $('.ui.search').search('set value', '');
    $('#book_list_wrapper').hide();
    $('#book_panel').show();
    $('#btns_add_book').hide();
    $('#manual_authors .message').hide();
}

function check_form(){
    $('form .field').removeClass('error');
    $('form .ui.message').hide();
    var result = true;
    var message = '';
    if($('#form_book').val().length === 0){
        message += '책을 선택하세요. ';
        result = false;
    }

    $('#form_rating').val($('.rating').starRating('getRating')*2);
    if($('form input[type="checkbox"]').prop('checked'))
        $('form input[name="is_secret"]').val(1);
    else {
        $('form input[name="is_secret"]').val(0);
    }

    if(!result){
        $('.ui.message p').text(message);
        $('form .ui.message').addClass('error');
        $('form .ui.message').show();
    }

    return result;
}

$(document).ready(function(){
    bookPanel = new Vue({
        el: '#book_panel',
        data: {
            title: '',
            isbn13: '',
            strAuthors: '',
            coverURL: '',
            publisher: '',
            publishedDate: '',
            show: false
        }
    });
    $('.remove.icon').parent().click(function(){
        $('.modal').modal('hide');
    });

    $('.ui.modal').modal();
    $('#btn_manual_book').click(
        function() {
            $('.ui.modal').modal('show');
        }
    );

    $('#book_panel').hide();

    $('.ui.search').search({
        apiSettings:{
            url: "/bookshelf/api/searchbook?keyword={query}",
            onResponse: function(res) {
                if (res.error)
                    console.log(res.error);
                else {
                    res.result.forEach(book => {
                        book.strAuthors = book.authors.map(author => author.name + ' ' + author.type).join(', ');
                        book.desc = book.strAuthors + ' | ' + book.publisher + ' | ' + book.publishedDate;
                    });
                    return res;
                }
            }
        },
        searchDelay: 1000,
        //source: content,
        onSelect: function(result, response){
            if(result.isbn13.length === 0){

            }
            setBook(result);
            $('#form_date_started').focus();
        },
        fields:{
            results: 'result',
            description: 'desc',
            image: 'coverURL'
        }
    });

    $('.rating').starRating({
        starShape: 'rounded',
        starSize: 25,
        disableAfterRate: false
    });

    $('#mod_btn').click(function(){
        $('form *').removeAttr('readonly');
        $('.rating').starRating('setReadOnly', false);
        $('.ui.buttons').show();
        $(this).hide();
    });

    $('#can_btn').click(function(){
        $('.rating').starRating('setRating', parseInt($('#form_rating').val()) / 2);
        resetBook();
    });

    $('#change_book').click(function(){
        resetBook();
    });

    // $('#manual_authors .multiple.selection').dropdown({
    //     allowAdditions: true,
    //     action: function(text, value){
    //         var typeKor = $('#manual_author_type').dropdown('get text');
    //         var typeEng = authorTypeTrans[typeKor];
    //         authors.push({name: text, type: typeEng, text:text+'('+typeKor+')'});
    //         $('#manual_authors .multiple.selection').dropdown('set selected', [text+'('+typeKor+')']);
    //     },
    //     onRemove: function(value){
    //         for(var i = 0; i < authors.length; i++){
    //             var author = authors[i];
    //             if(value === author.text){
    //                 authors.splice(i, 1);
    //                 return;
    //             }
    //         }
    //     }
    // });

    $('#manual_authors').find('input.search').keydown(function(evt){
        switch (evt.which){
            case 38: //up
                var index = $('#manual_author_type').dropdown('get value');
                $('#manual_author_type').dropdown('set selected', parseInt(index) - 1);
                break;
            case 40: //down
                var index = $('#manual_author_type').dropdown('get value');
                $('#manual_author_type').dropdown('set selected', parseInt(index) + 1);
                break;
        }
    });
    $('#manual_author_type').dropdown('set selected', 1);
});

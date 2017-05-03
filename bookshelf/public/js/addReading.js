var authors = [];
function manualSelectBook(){
    for(var i = 0; i < authors.length; i++){
        delete authors[i].text;
    }

    var book = {};
    //language=JQuery-CSS
    book.title = $('#manual_book_form input[name="title"]').val();
    book.publisher = $('#manual_book_form input[name="publisher"]').val();
    book.published_date = $('#manual_book_form input[name="published_date"]').val();
    var isbn = $('#manual_book_form input[name="isbn"]').val();
    book.isbn13 = (isbn.length == 10) ? '978'+isbn : isbn;
    book.cover_URL = $('#manual_book_form input[name="cover_URL"]').val();
    book.subtitle = $('#manual_book_form input[name="subtitle"]').val();
    book.original_title = $('#manual_book_form input[name="original_title"]').val();
    book.pages = $('#manual_book_form input[name="pages"]').val();
    book.authors = authors;

    setBook(book);
    $('.modal').modal('hide');
    return false;
}


function resetBook(){
    $('#form_isbn13').val('');
    $('#form_book').val('');
    $('#book_panel').hide();
    $('#btns_add_book').show();
}

function selectBook(isbn13){

    $.ajax({
        url: '/bookshelf/api/bookinfo/aladin?isbn13='+isbn13,
        dataType: 'json',
        success: function(data){
            if(data.ok === 0){
                console.log('error');
                return;
            }
            var book = data.result;
            setBook(book);
        }
    });

}

function formatAuthors(authors){
    var formatted_authors = '';
    for(var i in authors){
        var author = authors[i];
        formatted_authors += author.name;
        switch(author.type){
            case 'author':
                formatted_authors += ' 지음, ';
                break;
            case 'translator':
                formatted_authors += ' 번역, ';
                break;
            case 'supervisor':
                formatted_authors += ' 감수, ';
                break;
            case 'illustrator':
                formatted_authors += ' 그림, ';
                break;
        }
    }
    formatted_authors = formatted_authors.substring(0, formatted_authors.length-2) + '.';
    return formatted_authors;
}

function setBook(book){
    $('#form_isbn13').val(book.isbn13);
    $('#book_cover').attr('src',book.cover_URL);
    $('#book_title').text(book.title);
    $('#book_authors').text(formatAuthors(book.authors));
    $('#book_publish').text(book.publisher + ' | ' + book.published_date);
    $('.ui.search').search('set value', '');
    $('#book_list_wrapper').hide();
    $('#book_panel').show();
    $('#btns_add_book').hide();
    $('#form_book').val(JSON.stringify(book));
}

function searchBookByKeyword(keyword, callback){
    $.ajax({
        url:"/bookshelf/api/searchbook?keyword=" + keyword,
        dataType: "json",
        success: function(data){
            var bookList =  $('#book_list');
            bookList.empty();
            $.each(data, function(index, item){
                //$('#dummy_book').clone().attr(item).attr('id', 'book_'+index).css('display', 'block').text(item.title).click(selectBook).hover(hoverBook).appendTo(bookList);
                bookList.append($('<li />', {
                    id: 'book_'+index,
                    text: item.title,
                    class: 'book'
                }));
                $('#book_'+index).attr(item).click(selectBook).hover(hoverBook);
            });
            $('#book_list_wrapper').show();
        }
        //callback(data)
    });
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

    if($('#form_date_started').val().length === 0){
        $('#form_date_started').parent().addClass('error');
        message += '책을 읽기 시작한 날짜를 선택하세요. ';
        result = false;
    }

    if($('#form_user').val().length === 0){
        $('#form_user').parent().addClass('error');
        message += '당신은 누구인가요?';
        result = false;
    }

    if(!result){
        $('.ui.message .header').text('어딘가 비어있는 폼.');
        $('.ui.message p').text(message);
        $('form .ui.message').addClass('error');
        $('form .ui.message').show();
    }

    return result;
}

function DelayedHandler(){
//execute handler after millisec if the event not aroused until millisec.
//var test = new DelayedHandler(); $('#id').keyon(test.start(handler, milliseconds));
    this.timer = null;
    this.handler= '';
    this.millisec = '';

    this.start = function(handler, millisec){
        if(this.timer){
            clearInterval(this.timer);
        }
        this.timer = setTimeout(handler, millisec);
    };
}

//author type translation
var authorTypeTrans = {
    '저자': 'author',
    '역자': 'translator',
    '감수': 'supervisor',
    '그림': 'illustrator',
    '사진': 'photo'
};

$(document).ready(function(){
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
    $('#book_search').keyup(function(){
        var title = $('#book_search').val();
        if(title.length === 0){
            $('#book_list_wrapper').hide();
            $('#book_search_bar').removeClass('loading');
        } else{
            $('#book_search_bar').addClass('loading');
            delayedHnadlerForTitle.start(function(){
                searchBookByKeyword(title);
                $('#book_search_bar').removeClass('loading');
            }, 1500);
        }
    });

    $('#book_search').focus(function(){
        if($('#book_search').val().length !== 0){
            $('#book_list_wrapper').show();
        }
    });
    $('.ui.search').search({
        apiSettings:{
            url: "/bookshelf/api/searchbook?keyword={query}"
        },
        searchDelay: 1000,
        //source: content,
        onSelect: function(result, response){
            selectBook(result.isbn13);
        },
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

    $('#ok_btn').click(function(){
        if(!check_form()) return;
        $('#form_rating').val($('.rating').starRating('getRating')*2);
        if($('form input[type="checkbox"]').prop('checked'))
            $('form input[name="is_secret"]').val(1);
        else {
            $('form input[name="is_secret"]').val(0);
        }

        $('#input_form').submit();
    });

    $('#can_btn').click(function(){
        $('.rating').starRating('setRating', parseInt($('#form_rating').val()) / 2);
        resetBook();
    });

    $('#change_book').click(function(){
        resetBook();
    });

    $('#manual_authors .multiple.selection').dropdown({
        allowAdditions: true,
        action: function(text, value){
            var typeKor = $('#manual_author_type').dropdown('get text');
            var typeEng = authorTypeTrans[typeKor];
            authors.push({name: text, type: typeEng, text:text+'('+typeKor+')'});
            $('#manual_authors .multiple.selection').dropdown('set selected', [text+'('+typeKor+')']);
        },
        onRemove: function(value){
            for(var i = 0; i < authors.length; i++){
                var author = authors[i];
                if(value == author.text){
                    authors.splice(i, 1);
                    return;
                }
            }

        }
    });
    $('#manual_authors input.search').keydown(function(evt){
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

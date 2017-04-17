var selectedBook;

function resetBook(){
    $('#form_isbn13').val('');
    $('#form_book').val('');
    $('#book_panel').hide();
    $('.ui.search').show();
}

function selectBook(isbn13){
    console.log('tes');

    $.ajax({
        url: '/bookshelf/api/bookinfo/aladin?isbn13='+isbn13,
        dataType: 'json',
        success: function(data){
            if(data.ok === 0){
                console.log('error');
                return;
            }
            var book = data.result;
            var authors = '';
            for(var i in book.authors){
                var author = book.authors[i];
                authors += author.name;
                switch(author.type){
                    case 'author':
                        authors += ' 지음, ';
                        break;
                    case 'translator':
                        authors += ' 번역, ';
                        break;
                    case 'supervisor':
                        authors += ' 감수, ';
                        break;
                    case 'illustrator':
                        authors += ' 그림, ';
                        break;
                }
            }
            authors = authors.substring(0, authors.length-2) + '.';
            console.log(authors);
            $('#form_isbn13').val(book.isbn13);
            $('#book_cover').attr('src',book.cover_URL);
            $('#book_title').text(book.title);
            $('#book_authors').text(authors);
            $('#book_publish').text(book.publisher + ' | ' + book.published_date);
            $('.ui.search').search('set value', '');
            $('#book_list_wrapper').hide();
            $('#book_panel').show();
            $('.ui.search').hide();
            $('#form_book').val(JSON.stringify(book));
            //selectedBook = book;
        }
    });

}

function searchBookByKeyword(keyword, callback){
    $.ajax({
        url:"/bookshelf/api/searchbook?keyword=" + keyword,
        dataType: "json",
        success: function(data){
            //console.log(data);
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
                //console.log(item.title + ": " + item.author);
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

$(document).ready(function(){
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
        onResults: function(response){
            console.log(response);
        }
    });

    $('.rating').starRating({
        starShape: 'rounded',
        starSize: 25,
        disableAfterRate: false,
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
});

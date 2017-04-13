function selectBook(){
    var isbn13 = this.getAttribute('isbn13');
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
            $('#form_book').val(JSON.stringify(book));
            $('#book_list_wrapper').hide();
            $('#book_panel').show();
        }
    });

}

function hoverBook(evt){
    $('#book_info img').attr('src', this.getAttribute('cover_url'));
    $('#book_info strong').text(this.getAttribute('title'));
    $('#book_info img').attr('src', this.getAttribute('cover_url'));
    $('#book_info li:nth-child(1)').text(this.getAttribute('author'));
    $('#book_info li:nth-child(2)').text(this.getAttribute('publisher')+" | " + this.getAttribute('published_date'));
}

function searchBookByKeyword(keyword, callback){
    $.ajax({
        url:"api/searchbook?keyword=" + keyword,
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
    if($('#form_isbn13').val().length != 13){
        alert('책을 선택하세요.');
        return false;
    }

    if($('#form_start_date').val().length === 0){
        alert('책을 읽기 시작한 날짜를 입력하세요.');
        return false;
    }

    return true;
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

var delayedHnadlerForTitle = new DelayedHandler();

$(document).ready(function(){
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
});

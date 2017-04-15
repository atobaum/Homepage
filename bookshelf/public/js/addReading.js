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
            $('#form_book').val(JSON.stringify(book));
            $('#book_search').val('');
            $('#book_list_wrapper').hide();
            $('#book_panel').show();
            $('.ui.search').hide();
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


var content = [
  {
    "title": "하스켈로 배우는 함수형 프로그래밍",
    "author": "오카와 노리유키 지음, 정인식 옮김",
    "published_date": "2015-08-21",
    "publisher": "제이펍",
    "isbn13": "9791185890296",
    "cover_URL": "http://image.aladin.co.kr/product/6486/90/coveroff/k952433349_1.jpg"
  },
  {
    "title": "가장 쉬운 하스켈 책 - 느긋하지만, 우아하고 세련된 함수형 언어",
    "author": "미란 리포바카 지음, 황반석 옮김",
    "published_date": "2014-02-25",
    "publisher": "비제이퍼블릭",
    "isbn13": "9788994774619",
    "cover_URL": "http://image.aladin.co.kr/product/3696/4/coveroff/8994774610_1.jpg"
  },
  {
    "title": "Learn You a Haskell for Great Good!: A Beginner's Guide (Paperback)",
    "author": "Miran Lipovaca",
    "published_date": "2011-04-21",
    "publisher": "No Starch Pr                            ",
    "isbn13": "9781593272838",
    "cover_URL": "http://image.aladin.co.kr/product/748/90/coveroff/1593272839_2.jpg"
  },
  {
    "title": "Stardust Melody (Paperback)",
    "author": "마리 하스켈 (Mary Haskell)",
    "published_date": "1985-03-01",
    "publisher": "Jove Pubns                              ",
    "isbn13": "9780425079799",
    "cover_URL": "http://image.aladin.co.kr/product/7987/42/coveroff/0425079791_2.jpg"
  },
  {
    "title": "Programming in Haskell (Paperback)",
    "author": "Hutton, Graham",
    "published_date": "2007-01-15",
    "publisher": "Cambridge Univ Pr",
    "isbn13": "9780521692694",
    "cover_URL": "http://image.aladin.co.kr/product/159/59/coveroff/0521692695_1.jpg"
  }
];

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
});

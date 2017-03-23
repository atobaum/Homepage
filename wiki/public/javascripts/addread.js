function selectBook(){
    $('#form_isbn13').val(this.getAttribute('isbn13'));
    $('#book_list_panel').css('display', 'none');
}

function hoverBook(){
    $('#book_info img').attr('src', this.getAttribute('cover_url'));
    $('#book_info strong').text(this.getAttribute('title'));
    $('#book_info img').attr('src', this.getAttribute('cover_url'));
    $('#book_info li:nth-child(1)').text(this.getAttribute('author'));
    $('#book_info li:nth-child(2)').text(this.getAttribute('publisher')+" | " + this.getAttribute('published_date'));
}

function searchBookByKeyword(keyword, callback){
    $.ajax({
        url:"api/searchbook?word=" + keyword,
        dataType: "json",
        success: function(data){
            //console.log(data);
            var bookList =  $('#book_list');
            bookList.empty();
            $.each(data, function(index, item){
                $('#dummy_book').clone().attr(item).attr('id', 'book_'+index).css('display', 'block').text(item.title).click(selectBook).hover(hoverBook).appendTo(bookList);
                //console.log(item.title + ": " + item.author);
            });
            $('#book_list_panel').css('display', 'block');
        }
        //callback(data)
    });
}

function check_form(){
    if($('#form_isbn13').val().length != 13){
        alert('책을 선택하세요.');
        return false;
    }

    if($('#form_start_date').val().length == 0){
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
        return function(){
            if(this.timer){
                clearInterval(this.timer);
            }
            this.timer = setTimeout(handler, millisec);
        };
    };
}

var delayedHnadlerForTitle = new DelayedHandler();

$(document).ready(function(){
    $('#book_search').keyup(delayedHnadlerForTitle.start(function(){
        var title = $('#book_search').val();
        searchBookByKeyword(title);
        //console.log(title);
    }, 1500));
});

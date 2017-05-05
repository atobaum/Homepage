function format_authors(authors){
    var author = '';
    for(var i in authors){
        var aut = authors[i];
        author += '<a href="/bookshelf/person/' + aut.id + '">' + aut.name + '</a>';
        switch(aut.type){
            case "author":
                author += " 지음, ";
                break;
            case "translator":
                author +=  " 번역, ";
                break;
            case "supervisor":
                author += " 감수, ";
                break;
            case "illustrator":
                author += " 그림, ";
                break;
            case "photo":
                author += " 사진, ";
                break;
        }
    }
    author =  author.substring(0, author.length-2);
    return author;
}

function addReadingToTable(reading){
    var book = reading.book;
    if(reading.date_started == '1000-01-01')
        reading.date_started = '???';
    if(!reading.date_finished)
        reading.date_finished = '읽는 중';
    else if(reading.date_finished == '1000-01-01')
        reading.date_finished = '???';


    var content = "";
    content += '<tr>';
    if(reading.book) {
        content += '<td><a href="/bookshelf/book/' + book.isbn13 + '">' + book.title_ko + '</a></td>';
        content +=     '<td>'+format_authors(book.authors)+'</td>';
    } else {
        content += '<td>(책 정보 없음: '+reading.book_id+') <a href="/bookshelf/book/' + reading.book_id + '">추가</a></td>';
        content += '<td>책 정보 없음</td>';
    }
    content +=     '<td><a href="/bookshelf/reading/'+reading.id+'">'+reading.date_started + ' ~ ' + reading.date_finished + '</a></td>';
    content +=     '<td>'+reading.user+'</td>';
    content += '</tr>';
    $('#tbdReadings').append(content);
}

function getRecentReadings(page, articlePerPage){
    $.ajax({
        type:"get",
        url: "/bookshelf/api/recentReading?page="+page,
        success: function(response){
            if(response.ok === 0){
                alert('오류 발생. 관리자에게 문의하세요.');
                return;
            }
            var readings = response.result.readings;
            var maxPage = response.result.maxPage;
            $('#tbdReadings').empty();
            for(var i in readings){
                addReadingToTable(readings[i]);
            }

            var btnPage = $('<a href="#"/>').addClass('item');

            var paginationMenu = $('.pagination.menu');
            paginationMenu.empty();
            var startPage = (page - 5 >0) ? page-5 : 1;
            for(var i = 0 ; i < 10 ; i++){
                var tmp = btnPage.clone().text(startPage).click(function(){
                    getRecentReadings($(this).text());
                });
                if(startPage++ == page) tmp.addClass('active');
                tmp.appendTo(paginationMenu);
                if (startPage > maxPage) break;
            }
        },
        error: function(){alert('error');}
    });
}

$(document).ready(function(){
    getRecentReadings(1);
});

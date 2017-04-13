function format_authors(authors){
    var author = '';
    for(var i in authors){
        var aut = authors[i];
        switch(aut.type){
            case "author":
                author += aut.name += " 지음, ";
                break;
            case "translator":
                author += aut.name += " 번역, ";
                break;
            case "supervisor":
                author += aut.name += " 감수, ";
                break;
            case "illustrator":
                author += aut.name += " 그림, ";
                break;
        }
    }
    author =  author.substring(0, author.length-2);
    return author;
}

function addReadingToTable(reading){
    var book = reading.book;
    var author = '';
    for(var i in book.authors){
        var aut = book.authors[i];
        switch(aut.type){
            case "author":
                author += aut.name += " 지음, ";
                break;
            case "translator":
                author += aut.name += " 번역, ";
                break;
            case "supervisor":
                author += aut.name += " 감수, ";
                break;
            case "illustrator":
                author += aut.name += " 그림, ";
                break;
        }
    }
    author =  author.substring(0, author.length-2);
    author = format_authors(book.authors);
    var content = "";
    content += '<tr>';
    content +=     '<td><a href="/book/'+book.isbn13+'">'+book.title_ko+'</a></td>';
    content +=     '<td>'+author+'</td>';
    content +=     '<td><a href="/reading/'+reading.id+'">'+reading.date_started+'</a></td>';
    content +=     '<td>'+reading.date_finished+'</td>';
    content += '</tr>';
    $('#tbdReadings').append(content);
}

$(document).ready(function(){
    $.ajax({
        type:"get",
        url: "/bookshelf/api/recentReading",
        success: function(response){
            if(response.ok == 0){
                alert('error');
                return;
            }
            var readings = response.result;
            for(var i in readings){
                addReadingToTable(readings[i]);
            }
        },
        error: ()=>{alert('error');}
    });
});

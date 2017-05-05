var authors = [];
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
            if(book.authors){
                setBook(book);
            } else{ //need manual adding
                authors = [];
                var form = $('#manual_book_form');

                //setting message box
                var messageBox = form.parent().find('.ui.message');
                messageBox.addClass('negative');
                messageBox.find('.header').text('책 자동 추가 실패. 저자를 수동으로 추가해주세요.');
                messageBox.find('p').text("저자: " + book.authorsText);
                messageBox.show();

                //setting input text
                form.find('input[name="title"]').val(book.title);
                form.find('input[name="publisher"]').val(book.publisher);
                form.find('input[name="published_date"]').val(book.published_date);
                form.find('input[name="isbn"]').val(book.isbn13);
                form.find('input[name="cover_URL"]').val(book.cover_URL);
                form.find('input[name="original_title"]').val(book.original_title);
                form.find('input[name="pages"]').val(book.pages);

                $('#manual_author_type').dropdown('clear');
                $('#manual_author_type').dropdown('set selected', 1);
                $('.modal.small').modal('show');
                //$('#manual_author_type').dropdown('set selected', 1);
            }
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
    };

    if(!result){
        //$('.ui.message .header').text('어딘가 비어있는 폼.');
        $('.ui.message p').text(message);
        $('form .ui.message').addClass('error');
        $('form .ui.message').show();
    }

    $('#form_rating').val($('.rating').starRating('getRating')*2);
    if($('form input[type="checkbox"]').prop('checked'))
        $('form input[name="is_secret"]').val(1);
    else {
        $('form input[name="is_secret"]').val(0);
    }

    return result;
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

    $('.ui.search').search({
        apiSettings:{
            url: "/bookshelf/api/searchbook?keyword={query}",
            onResponse: function(res) {
                $.each(res.result, function(index, item){
                    item.desc = item.author + ' | ' + item.publisher + ' | ' + item.published_date;
                });
                return res;
            }
        },
        searchDelay: 1000,
        //source: content,
        onSelect: function(result, response){
            selectBook(result.isbn13);
            $('#form_date_started').focus();
        },
        fields:{
            results: 'result',
            description: 'desc',
            image: 'cover_URL'
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

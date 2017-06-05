/**
 * Created by Le Reveur on 2017-04-24.
 */

function Renderer(){

}

Renderer.prototype.blockquote = function(text){
    "use strict";
    return `<blockquote class="ui piled segment"><p>${text}</p></blockquote>`
};

Renderer.prototype.title = function(data){
    return `<h1 class="ui block header">${data.text}</h1>`;
};

Renderer.prototype.escapeHTML = function(str){
    "use strict";
    return str.replace(/[&<"']/g, function(m) {
        switch (m) {
            case '&':
                return '&amp;';
            case '<':
                return '&lt;';
            case '"':
                return '&quot;';
            default:
                return '&#039;';
        }
    });
};

Renderer.prototype.heading = function(data) {
    return '<h'
        + data.level
        + ' class="ui dividing header" id="'
        + data.id
        + '">'
        + data.text
        + '</h'
        + data.level
        + '>\n';
};
Renderer.prototype.italicbold = function(data){
    return '<b><i>'+data.text+'</i></b>';
};

Renderer.prototype.italic = function(data){
    return '<i>'+data.text+'</i>';
};

Renderer.prototype.bold = function(data){
    return '<b>'+data.text+'</b>';
};

Renderer.prototype.underline = function(data){
    return '<u>'+data.text+'</u>';
};

Renderer.prototype.sup = function(data){
    return '<sup>'+data.text+'</sup>';
};

Renderer.prototype.sub = function(data){
    return '<sub>'+data.text+'</sub>';
};

Renderer.prototype.del = function(data){
    return '<del>'+data.text+'</del>';
};

Renderer.prototype.newline = function(){
    return '<br />'
};

Renderer.prototype.link = function(data){
    var text = (data.text ? data.text : data.href);
    return '<a href="\/wiki\/view\/'+data.href+'" title="'+text+'">'+text+'</a>';
};

Renderer.prototype.urlLink = function(data){
    var text = (data.text ? data.text :data.href);
    return `<a class="wiki_ext_link" href="${data.href}" title="${text}">${text}<i class="external square icon"></i></a>`;
};

Renderer.prototype.image = function(data){
    return '<img src="'+data.src+'" />';
};

Renderer.prototype.text = function(data){
    return data.text;
};

//footnote reference
Renderer.prototype.rfn = function(data){
    return `<sup><a class="wiki_rfn" id="rfn_${data.index}" href="#fn_${data.index}" title="${data.text}">[${data.index}]</a></sup>`
};

Renderer.prototype.footnotes = function(footnotes){
    var result = '<hr><ul class="wiki_fns">';
    footnotes.forEach(function(fn, index){
        result += `<li><a class="wiki_fn" id="fn_${index + 1}" href="#rfn_${index + 1}" title="${fn.text}">[${index + 1}]</a> ${fn.text}</li>`;
    });
    result += "</ul>";
    return result;
};

Renderer.prototype.toc = function(data){
    return ['<sup><a class="footnote_content" id="rfn_'+data.index+'" href="#fn_'+data.index+'" title="'+data.text+'"></a></sup>'
        , '<a id="fn_'+data.index+'" href="#rfn_'+data.index+'">['+data.index+']</a> '+data.text];
};

Renderer.prototype.assemble = function(content, toc, footnotes){
    return toc+content+footnotes;
};

Renderer.prototype.paragraph = function(data){
    return '<p>'+data.text+'</p>';
};

Renderer.prototype.emptyline = function(data){
    return '<br />';
};

Renderer.prototype.hr = function(){
    return '<hr />';
}

Renderer.prototype.list = function(list, notFirst){
    var ordered = list[0].ordered;
    var result = !notFirst ? '<div class="wiki_list">' : '';
    result += `<${ordered ? 'o' : 'u'}l ${!notFirst ? 'class = "ui list"' : ''}>`;

    for(var i = 0; i < list.length; i++){
        var item = list[i];
        result += `<li>${item.text + (item.child ? this.list(item.child, 1) : '')}</li>`;
    }
    result += ordered ? '</ol>' : '</ul>';
    result += (!notFirst ? '</div>' : '');
    return result;
};

Renderer.prototype.toc = function(toks, notFirst) {
    var result = !notFirst ? '<div class="ui segment compact wiki_toc">' : '';
    result += `<ol class="${!notFirst ? 'ui list' : ''}">`;

    for(var i = 0; i < toks.length; i++){
        var item = toks[i];
        //result += `<li>${item.text + (item.child ? this.toc(item.child, 1) : '')}</li>`;
        result += `<li><a href="#${item.id}" id="r${item.id}">${item.text}</a>${item.child ? this.toc(item.child, 1) : ''}</li>`;
    }
    result += '</ol>';
    result += (!notFirst ? '</div>' : '');
    return result;
};

Renderer.prototype.cat = function(categories){
    "use strict";
    var result = categories.map((item)=>{
        return `<sapn><a href="/wiki/view/Category:${item}">${item}</a></sapn>`
    }).join(' | ');
    return '<div class="wiki-cat ui segment">카테고리: '+result+'</div>';
};

Renderer.prototype.syntax = function(tok){
    var result = "<pre class='line-numbers"+(tok.param ? " language-"+tok.param : "")+"'><code>";
    result += tok.text;
    result += "</code></pre>";
    return result;
};

Renderer.prototype.error = function(tok){
    "use strict";
    return `<div class="ui negative message"><div class="header">${tok.name}</div><p>${tok.text}</p></div>`
};

Renderer.prototype.table = function(table){
    var result = '<table class="ui celled table">';
    for(var item of table){
        if(item.additional == "h"){
            result += '<thead><tr>';
            item.row.forEach((cell)=>{result += `<th>${cell}</th>`});
            result += '</tr></thead>';
        } else{
            result += '</tr>';
            item.row.forEach((cell)=>{result += `<td>${cell}</td>`});
            result += '</tr>';
        }
    }
    return result + '</table>';
};

module.exports = Renderer;
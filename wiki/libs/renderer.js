/**
 * Created by Le Reveur on 2017-04-24.
 */
"use strict";
let katex = require("katex");

class Renderer{
    constructor() {
        this._ns = null;
    }

    set ns(ns) {
        if (ns === "Main") this._ns = null;
        else this._ns = ns;
    }

    blockquote(tok){
        let title = tok.title ? `<h4 class="header">${tok.title}</h4>` : '';
        let ref = tok.ref ? `<p class="wiki_quote_ref">${tok.ref}</p>` : '';
        return `<blockquote class="ui raised segment">${title}<p>${tok.text}</p>${ref}</blockquote>`
    };

    title(data){
        return `<h1 class="ui block header">${data.text}</h1>`;
    };

    escapeHTML(str){
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

    heading(data) {
        let indexList = data.indexList;
        let formatedLevel = indexList.join('_');
        return '<h'
            + (indexList.length)
            + ' class="ui dividing header" id="'
            + "h_"+ formatedLevel
            + '">'
            + `<a href="#rh_${formatedLevel}">${indexList.join('.')}</a> `
            + data.content.text
            + '</h'
            + indexList.length
            + '>';
    };

    italicbold(data){
        return '<b><i>'+data.text+'</i></b>';
    };

    italic(data){
        return '<i>'+data.text+'</i>';
    };

    bold(data){
        return '<b>'+data.text+'</b>';
    };

    underline(data){
        return '<u>'+data.text+'</u>';
    };

    sup(data){
        return '<sup>'+data.text+'</sup>';
    };

    sub(data){
        return '<sub>'+data.text+'</sub>';
    };

    del(data){
        return '<del>'+data.text+'</del>';
    };

    newline(){
        return '<br />'
    };

    link(data, env) {
        let regexTitle = /^(?:(.*?):)?(.+?)(?:#(.*))?$/;
        let parsedHref = regexTitle.exec(data.href);
        let href = parsedHref[2];
        if(parsedHref[1]){//Namespace exists
            href = parsedHref[1] + ':' + href;
        } else if (parsedHref[1] === undefined && this._ns) {
            href = this._ns + ':' + href;
        }
        let text = (data.text ? data.text : data.href);
        let isExist = env.existingPages.indexOf(href.toLowerCase()) >= 0;
        if (parsedHref[3]) href += '#' + parsedHref[3];
        return `<a ${isExist ? '' : 'class="wiki_nonexisting_page"'} href="\/wiki\/view\/${href}" title="${text}">${text}</a>`;
    };

    urlLink(data){
        let text = (data.text ? data.text :data.href);
        return `<a class="wiki_ext_link" href="${data.href}" title="${text}">${text}<i class="external square icon"></i></a>`;
    };

    image(data){
        return '<img src="'+data.src+'" />';
    };

    text(data){
        return data.text;
    };

    KaTeX(tok){
        try {
            return katex.renderToString(tok.text, {displayMode: tok.displayMode});
        } catch (e) {
            return this.error({name: 'KaTeX Error', text: e.message});
        }
    };


    //footnote reference
    rfn(data){
        return `<sup id="rfn_${data.index}"><a href="#fn_${data.index}">[${data.index}]</a></supi>`;
    };

    footnotes(footnotes){
        let result = '<hr><ul class="wiki_fns">';
        footnotes.forEach(function(fn, index){
            result += `<li><a class="wiki_fn" id="fn_${index}" href="#rfn_${index}">[${index}]</a> ${fn.text}</li>`;
        });
        result += "</ul>";
        return result;
    };

    paragraph(data){
        return '<p>'+data.text+'</p>';
    };

    emptyline(data){
        return '<br />';
    };

    hr(){
        return '<hr />';
    }

    list(list, notFirst){
        let ordered = list[0].ordered;
        let result = !notFirst ? '<div class="wiki_list">' : '';
        result += `<${ordered ? 'o' : 'u'}l ${!notFirst ? 'class = "ui list"' : ''}>`;

        for(let i = 0; i < list.length; i++){
            let item = list[i];
            result += `<li>${item.text + (item.child ? this.list(item.child, 1) : '')}</li>`;
        }
        result += ordered ? '</ol>' : '</ul>';
        result += (!notFirst ? '</div>' : '');
        return result;
    };

    toc(toks, first = true) {
        let result = first ? '<div class="ui segment compact wiki_toc">' : '';
        result += `<ol class="${first ? '' : ''}">`;
        toks.forEach(item => {
            result += '<li id="rh_' + item.indexList.join('_') + '">' + item.indexList.join('.') + ' <a  href="#h_' + item.indexList.join('_') + '">' + item.content.plainText + '</a>';
            if (item.child.length !== 0) result += this.toc(item.child, false);
            result += '</li>';
        });
        result += '</ol>';
        result += (first ? '</div>' : '');
        return result;
    };

    cat(categories){
        "use strict";
        let result = '';
        categories.forEach((item)=>{
            result += `<a class="ui horizontal label" href="/wiki/view/Category:${item}">${item}</a>`
        });
        return '<div class="wiki-cat ui segment">카테고리: '+result+'</div>';
    };

    syntax(tok){
        let result = "<pre class='wiki-syntaxhl line-numbers"+(tok.param ? " language-"+tok.param : "")+"'><code>";
        result += tok.text;
        result += "</code></pre>";
        return result;
    };

    error(tok){
        return `<div class="ui negative message"><div class="header">${tok.name}</div><p>${tok.text}</p></div>`
    };

    table(table){
        let result = '<table class="ui celled collapsing table">';
        for(let item of table){
            if (item.option === "h") {
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

    title(ns, pageTitle){
        return `<h1 class="wiki_title">${(ns ? ns + ':' : '')+pageTitle}</h1>`;
    };

    pageList(catTitle, pageList) {
        return pageList.map((item, index) => {
            if (item.length === 0) return '';
            let result = '<h2>"' + catTitle + '"에 속하는 ';
            switch (index) {
                case 0:
                    result += ' 하위 분류';
                    break;
                case 1:
                    result += ' 문서';
                    break;
                case 2:
                    result += ' 파일';
                    break;
                default:
                    throw new Error('ERROR in pageList of renderer: Invalid category type = ' + index);
            }
            result += ' 목록</h2><hr /><ul>';
            result += item.reduce((sum, title) => sum + '<li><a href="\/wiki\/view\/' + title + '" title="' + title + '">' + title + '</a></li>', '') + '</ul>';
            return result;
        }).join('');
    }
}

module.exports = Renderer;
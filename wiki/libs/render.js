var blocks = {
    heading: /^={2,5} (.+) ={2,5}$/,
    paragraph: /^/,
    list: /^(\s+)(\*|-) (.+)/,
    indent: /^/,
    quote: /^/,
    quote2: /^/,
    code: /^/,
    math: /^/,
    table: /^/
};

var inlineTockens = {
    escape: /^\\([\\`*{}\[\]()#+\-.!_>])/,
    italic: /^''(?!')(?=\S)([\s\S]*?\S)''/,
    bold: /^'''(?!')(?=\S)([\s\S]*?\S)'''/,
    underline: /^__[](.+)__/,
    sup: /^\^\^(.+?)\^\^/,
    sub: /^,,(.+),,/,
    link: /^\[\[[^\|]+\|?[^\|]+\]\]/,
    del: /^~~(?=\S)([\s\S]*?\S)~~/,
    newline: /^  $/,
    footnote: /\(\(.+\)\)/,
    fontsize: /./,
    fontcolor: /./
};

function InlineParser(){

}

InlineParser.prototype.output = function(src){

}

function Lexer(){

}

Lexer.prototype.lex = function(){

};

function BlockParser(){

}

Parser.prototype.parse = function(){

};



function Renderer(){

}
Renderer.prototype.head = function(text, level, prefix, title) {
    return '<h'
        + level
        + ' id="'
        + this.options.headerPrefix
        + raw.toLowerCase().replace(/[^\w]+/g, '-')
        + '">'
        + text
        + '</h'
        + level
        + '>\n';
};

Renderer.prototype.italic = function(text){
    return '<i>'+text+'</i>';
};

Renderer.prototype.bold = function(text){
    return '<b>'+text+'</b>';
};

Renderer.prototype.underline = function(text){
    return '<u>'+text+'</u>';
};

Renderer.prototype.sup = function(text){
    return '<sup>'+text+'</sup>';
};

Renderer.prototype.sub = function(text){
    return '<sub>'+text+'</sub>';
};

Renderer.prototype.del = function(text){
    return '<del>'+text+'</del>';
};

Renderer.prototype.newline = function(){
    return '<br />'
};

Renderer.prototype.link = function(text, href){
    text = (text ? text :href);
    return '<a href="'+href+'" title="'+text+'">'+text+'</a>';
};

Renderer.prototype.image = function(text, src){
    return '<img src="'+src+'" />';
};

/**
 * @function Renderer.footnote
 * @param index
 * @param text
 * @returns {[out, footnote]}
 */
Renderer.prototype.footnote = function(text, index){
    return ['<sup><a class="footnote_content" id="rfn_'+index+'" href="#fn_'+index+'" title="'+text+'"></a></sup>'
        , '<a id="fn_'+index+'" href="#rfn_'+index+'">['+index+']</a> '+text];
};


module.exports = new Parser();

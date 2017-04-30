/**
 * Created by Le Reveur on 2017-04-24.
 */

function Renderer(){

}
Renderer.prototype.heading = function(data) {
    console.log('heading'+ JSON.stringify(data));
    return '<h'
        + data.level
        + ' id="'
        + '1'
        + '">'
        + data.text
        + '</h'
        + data.level
        + '>\n';
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
    text = (text ? text :href);
    return '<a href="\/wiki\/v\/'+data.href+'" title="'+data.text+'">'+data.text+'</a>';
};

Renderer.prototype.urLlink = function(data){
    var text = (data.text ? data.text :data.href);
    return '<a href="'+data.href+'" title="'+text+'">'+text+'</a>';
};

Renderer.prototype.image = function(data){
    return '<img src="'+data.src+'" />';
};

Renderer.prototype.text = function(data){
    return data.text;
};

/**
 * @function Renderer.footnote
 * @param index
 * @param text
 * @returns {[out, footnote]}
 */
Renderer.prototype.footnote = function(data){
    return ['<sup><a class="footnote_content" id="rfn_'+data.index+'" href="#fn_'+data.index+'" title="'+data.text+'"></a></sup>'
        , '<a id="fn_'+data.index+'" href="#rfn_'+data.index+'">['+data.index+']</a> '+data.text];
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

module.exports = Renderer;
/**
 * Created by Le Reveur on 2017-07-12.
 */
"use strict";
let config = require('../main/config');
let assert = require('assert');
let wiki = require('../wiki/libs/wiki');
wiki = new wiki(config.wiki);

describe('Wiki', function () {
    describe('Getting page', function () {
        it('No namespace', function (done) {
            wiki.getParsedPage('No Namespase:No Page')
                .then(page => {
                    done(assert.equal(1, page.noPage))
                })
                .catch(done);
        });
        it('No page', function (done) {
            wiki.getParsedPage('Test:No Page')
                .then(page => {
                    done(assert.equal(2, page.noPage))
                })
                .catch(done);
        });
        it('Parsed page', function (done) {
            wiki.getParsedPage('Test:view test')
                .then((page) => {
                    done(assert.equal(`<h1 class="wiki_title">Test:view test</h1><div class="ui segment compact wiki_toc"><ol class="ui list"><li><a href="#h1" id="rh1">title</a></li></ol></div><h2 class="ui dividing header" id="h_1"><a href="#rh_1">1</a> title</h2>
<p>abc</p>`, page.parsedContent));
                })
                .catch(done);
        });

        it('Raw page', function (done) {
            wiki.getRawPage('Test:view test')
                .then((page) => {
                    done(assert.equal(`== title ==\r\nabc`, page.text));
                })
                .catch(done);
        });
    });

    describe('Edit page', () => {
        it('Edit views page', (done) => {
            let text = Math.random().toString();
            let minor = Math.random() > 0.5;
            let user = Math.random().toString().substr(8);
            let page = {
                title: 'Test:edit test',
                userText: user,
                text: text,
                minor: minor,
                comment: 'test' + text
            };
            wiki.editPage(page, null).then(() => {
                wiki.getRawPage('Test:edit test').then(data => {
                    done(assert.equal(text, data.text));
                }).catch(done);
            }).catch(done);
        });
    });

    describe('Category', () => {
        // it('get category list', (done) => {
        //     wiki.getPageList('test category')
        //         .then(data => {
        //             done(assert.deepEqual([['Test:edit test', 'Test:view test'], [], []], data));
        //         }).catch(done);
        // })
    });

    describe('User', ()=>{
        it('admin positive', (done)=>{
            wiki.checkAdmin(5)
                .then(admin=>done(assert.equal(admin, true)))
                .catch(done);
        });

        it('admin negative', (done)=>{
            wiki.checkAdmin(8)
                .then(admin => done(assert.equal(admin, false)))
                .catch(done);
        })
    });

    describe('Caching', ()=>{
        // it('clear cache', (done)=>{
        //     wiki.clearCache()
        //         .then(result => done(assert.equal(result, 1)))
        //         .catch(done);
        // });
    })
});

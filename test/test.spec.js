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
                    done(assert.equal(`<h1 class="wiki_title">Test:view test</h1><div class="ui segment compact wiki_toc"><ol class="ui list"><li><a href="#h1" id="rh1">title</a></li></ol></div><h2 class="ui dividing header" id="h_1"><a href="#rh_1">1</a> title</h1>
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
        it('Edit public page', (done) => {
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
    })
});

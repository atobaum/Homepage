"use strict";$(function(){var a=$("meta[name='wiki_title']").attr("content");$("pre.wiki-syntaxhl").each(function(a,b){Prism.highlightElement(b)}),$("#btn_etc").click(function(){$("#modal_etc").modal("show")}),$("#btn_clear_cache").click(function(){$.get({url:"/wiki/api/admin",data:{action:"clearCache",title:a},success:function(a){"use strict";a.ok?alert("Success clearing cache"):(alert("Fail clearing cache."),console.log("Error"+a.error.message))},error:function(a){console.log(a.responseText)}})}),$("#btn_change_title").click(function(){let b=prompt("\uC0C8 \uC81C\uBAA9\uC744 \uC785\uB825\uD558\uC138\uC694.");b&&$.get({url:"/wiki/api/admin",data:{action:"changeTitle",title:a,newTitle:b},success:function(a){a.ok?window.location="/wiki/view/"+a.title+"?updateCache":(console.log("Error"+a.error),alert("\uC81C\uBAA9 \uBC14\uAFB8\uAE30 \uC2E4\uD328"))},error:function(a){console.log(a.responseText)}})}),$("#btn_change_ac").click(function(){$.get({url:"/api/wiki/admin",data:{action:"getPAC",title:a},success:function(b){if(b.ok){let c=prompt(`Current PAC of this page, '${a}' is ${b.result}`);if(0>c||32<=c)return void alert("PAC\uB294 0\uC5D0\uC11C 31\uAE4C\uC9C0...");$.get({url:"/api/wiki/admin",data:{action:"setPAC",title:a,pac:c},success:function(a){a.ok?alert("\uC131\uACF5"):(alert("\uC2E4\uD328"),console.log(a))},error:function(a){alert(a.error)}})}else alert(b.error)},error:function(a){console.log(a.responseText)}})}),$(".wiki_fn").popup({hoverable:!0})});
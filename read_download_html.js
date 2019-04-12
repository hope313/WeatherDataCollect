const fs = require('fs');
const cheerio = require('cheerio');

const html_down_dir = './html_down/';

fs.readdir(html_down_dir, function (err, filename) {
    for(var i=0; i<filename.length; i++) {
        console.log(filename[i]);
        fs.readFile(html_down_dir + filename[i], function (err, data) {
            const $ = cheerio.load(data);

            console.log('title', $('title').text());

            // 경매 사건 정보 ------------------------------------------------------
            $('form[name=object_change] span').each(function (idx) {
                console.log($(this).text());
            });

            // 물번 ------------------------------------------------------
            console.log('[물번] : ', $('select[name=search_realty]').val());

            // 매각기일, 경매계 정보 ------------------------------------------------------
            $('table.kyg_detail_th_bg tr td').each(function (idx) {
                if(idx > 0) {
                    console.log($(this).text());
                }
            });

            console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^');

            // 물건 정보 ------------------------------------------------------
            $('div[name=basic_info] table tr').each(function (idx) {

                if(idx > 1) {                    
                    var fTitle = '';
                    var fValue = '';
                    $(this).children().each(function (cidx) {
                        if(this.tagName == 'th') fTitle = $(this).text().trim();
                        if(this.tagName == 'td') fValue = $(this).text().trim();
                        //console.log(idx + '[' + cidx + ']' + this.tagName, $(this).text().trim());
                        if(fTitle != '' && fValue != '') {
                            console.log('[' + fTitle + '] : ', fValue);
                            fTitle = '';
                            fValue = '';
                        }
                    });
                }

            });

            // 사진 정보 ------------------------------------------------------
            $('div[name=pic_map] table table img').each(function (idx) {
                console.log("[물건이미지] :", $(this).attr('src'));
            })

            // 토지 / 건물 현황 ------------------------------------------------------
            var gubun = '';         // 토지, 건물, 제시외 구분
            var title_arry = new Array();       // 항목 타이틀(지번, 용도/구조/대지권, 면적, 비고)
            var item_count = 0;     // 하위 항목 개수

            $('#bldg_info table tr').each(function (idx) {      // tr
                var item_values = new Array();      // 하위 항목 내용
                if(idx == 0) {
                    $(this).children().each(function (tidx) {       // td
                        if(tidx > 0) title_arry.push($(this).text());
                    });
                } else {
                    var temp = '';
                    $(this).children().each(function (cidx) {       // td
                        if(cidx == 0) {
                            if($(this).attr('rowspan') != undefined) {
                                gubun = $(this).text();
                                //item_count = $(this).attr('rowspan');
                            } else {
                                temp = '[' + $(this).text() + ']';
                            }
                            console.log("[" + gubun + temp + "]");      //, item_count);
                        }

                        item_values.push($(this).text().trim());
                    });
                }

                if(item_values.length > 5) item_values = item_values.splice(1);

                //console.log("item_values", item_values);

                if(idx > 0) {
                    for(var i=0; i<title_arry.length; i++) {
                        console.log("  - " + title_arry[i] + " : ", item_values[i+1]);
                    }
                }
            });

            // 지역분석 및 도로현황  ------------------------------------------------------
            console.log('[지역분석 및 도로현황]\n', '   ' + $('#idx_list_div').text().trim());

            console.log($('table.brd_title_sub tr td').text());
            /*
            $('table.brd_title_sub tr').each(function (idx) {
                console.log($(this).text());
            });
            */
            console.log('--------------------------------------------------------------------------------------------------------------');
        })
    }
})
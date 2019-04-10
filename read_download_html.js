const fs = require('fs');
const cheerio = require('cheerio');

const html_down_dir = './html_down/';

fs.readdir(html_down_dir, function (err, filename) {
    for(var i=0; i<filename.length; i++) {
        console.log(filename[i]);
        fs.readFile(html_down_dir + filename[i], function (err, data) {
            const $ = cheerio.load(data);

            console.log('title', $('title').text());

            // 경매 사건 정보
            $('form[name=object_change] span').each(function (idx) {
                console.log(idx, $(this).text());
            });

            // 물번
            console.log('mul_bun', $('select[name=search_realty]').val());

            // 매각기일, 경매계 정보
            $('table.kyg_detail_th_bg tr td').each(function (idx) {
                console.log(idx, $(this).text());
            });
            /*
            console.log('+++++++++++++++++++++++', $('div[name=basic_info][1] table').children('tr').length);
            $('div[name=basic_info][1] table').children('tr').each(function (idx) {
                console.log(idx, $(this).text());
            });
            */
            console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^');

            // 
            $('div[name=basic_info] table tr').each(function (idx) {
                // console.log(idx, $(this).children('th').text().trim() + " : " + $(this).children('td').text().trim());
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
            console.log('-------------------------------------------------------');
        })
    }
})
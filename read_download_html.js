const fs = require('fs');
const cheerio = require('cheerio');
const path = require('path');
const cfg = require('./module/config');
const commonFunc = require('./module/common_func');

// 파일 내용 읽어 데이터 파일 생성
fs.readdir(cfg.html_down_dir, function (err, filename) {
    for(var i=0; i<filename.length; i++) {
        console.log('>>>>>>>>>>>>>>>>>>> ', filename[i]);
        commonFunc.getData(filename[i]).then(function (data) {
            //console.log(data);
            const $ = cheerio.load(data);
            var info_txt = '';
            let auction_info = {};

            console.log('title', $('title').text());
            info_txt += $('title').text() + '\n';
            auction_info.title = $('title').text();

            // 경매 사건 정보 ------------------------------------------------------
            auction_info.sagun_infos = new Array();
            $('form[name=object_change] span').each(function (idx) {
                console.log($(this).text());
                info_txt += $(this).text();
                auction_info.sagun_infos.push($(this).text());
            });

            // 물번 ------------------------------------------------------
            console.log('[물번] : ', $('select[name=search_realty]').val());
            info_txt += '[물번] : ' + $('select[name=search_realty]').val();
            auction_info.mulbun = $('select[name=search_realty]').val();

            // 매각기일, 경매계 정보 ------------------------------------------------------
            $('table.kyg_detail_th_bg tr td').each(function (idx) {
                if(idx > 0) {
                    console.log($(this).text());
                    auction_info.maegak_kyeong_info = $(this).text();
                }
            });

            console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^');

            // 물건 정보 ------------------------------------------------------
            auction_info.mulgun_info = new Array();
            $('div[name=basic_info] table tr').each(function (idx) {

                if(idx > 1) {
                    var fTitle = '';
                    var fValue = '';
                    $(this).children().each(function (cidx) {
                        if(this.tagName == 'th') fTitle = $(this).text().trim();
                        if(this.tagName == 'td') fValue = $(this).text().trim();
                        //console.log(idx + '[' + cidx + ']' + this.tagName, $(this).text().trim());
                        if(fTitle != '' && fValue != '') {
                            console.log('[' + fTitle + '] : ', fValue.replace(/\t/g, ' '));
                            auction_info.mulgun_info.push('[' + fTitle + '] : ' + fValue.replace(/\t/g, ' '));
                            fTitle = '';
                            fValue = '';
                        }
                    });
                }

            });

            console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');

            // 사진 정보 ------------------------------------------------------
            auction_info.pic_infos = new Array();
            $('div[name=pic_map] table table img').each(function (idx) {
                console.log("[물건이미지] :", $(this).attr('src'));
                auction_info.pic_infos.push("[물건이미지] :" + $(this).attr('src'))
            });

            console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');

            // 토지 / 건물 현황 ------------------------------------------------------
            var gubun = '';         // 토지, 건물, 제시외 구분
            var title_arry = new Array();       // 항목 타이틀(지번, 용도/구조/대지권, 면적, 비고)
            var item_count = 0;     // 하위 항목 개수

            auction_info.land_building_infos = new Array();

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
                        if(item_values[i+1] != undefined) {
                            console.log("  - " + title_arry[i] + " : ", item_values[i+1]);
                            auction_info.land_building_infos.push("  - " + title_arry[i] + " : " + item_values[i+1]);
                        }
                    }
                }
            });

            console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');

            // 지역분석 및 도로현황  ------------------------------------------------------
            console.log('[지역분석 및 도로현황]', $('#idx_list_div').text().trim().replace(/\t|\n|\r/g, '').replace(/\]/g, ']\n   ').replace(/\[/g, '\n [').replace(/\./g, '.\n   '));
            auction_info.region_road_info = '[지역분석 및 도로현황]' + $('#idx_list_div').text().trim().replace(/\t|\n|\r/g, '').replace(/\]/g, ']\n   ').replace(/\[/g, '\n [').replace(/\./g, '.\n   ');

            console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');

            // 임자인 현황
            console.log('[임차인 현황]\n   ' + $('table.brd_title_sub tr td').eq(0).text().replace(/\t|\n|\r/g, '') + '\n');
            auction_info.renter = '[임차인 현황]\n   ' + $('table.brd_title_sub tr td').eq(0).text().replace(/\t|\n|\r/g, '') + '\n';

            var tenant_titles = new Array();
            var tenant_values = new Array();
            var tr_count = $('#tenant_info table').eq(0).children('tr').length;

            auction_info.tenant_infos = new Array();

            $('#tenant_info table').eq(0).children('tr').each(function (idx) {  
                //if(idx < tr_count-1) {
                    tenant_values[idx-1] = new Array();            
                    $(this).children().each(function (cidx) {
                        if(idx < 1) {       // 항목 타이틀
                            tenant_titles.push($(this).text());
                        } else {            // 항목 값
                            tenant_values[idx-1].push($(this).text().trim());
                        }
                    });
                //}
            });

            //console.log('@@@@@@@@@@@@@@@@@@@@tenant_titles : ', tenant_titles);
            //console.log('@@@@@@@@@@@@@@@@@@@@tenant_values : ', tenant_values);

            console.log('     *********************************************************************************');

            for(var i=0; i<tenant_values.length; i++) {
                for(var j=0; j<tenant_values[i].length; j++) {
                    console.log('[' + tenant_titles[j] + '] : ', tenant_values[i][j].replace(/\t|\n|\r/g, ' '));
                    auction_info.tenant_infos.push('[' + tenant_titles[j] + '] : ' + tenant_values[i][j].replace(/\t|\n|\r/g, ' '));
                }
                console.log('     *********************************************************************************\n');
            }
            
            //console.log($('#tenant_info > table').eq(1).text());
            var tenant2_titles = new Array();
            var tenant2_values = new Array();

            auction_info.tenant2_infos = new Array();

            $('#tenant_info > table').eq(1).children('tr').each(function (idx) {  
                //tenant_values[idx-1] = new Array();            
                $(this).children().each(function (cidx) {
                    if(this.tagName == 'th') {       // 항목 타이틀
                        tenant2_titles.push($(this).text());
                    } else {            // 항목 값
                        if($(this).attr('colspan')) {       // 주의사항/법원문건접수 요약 항목
                            var warning_msgs = $(this).text().trim().replace(/\t|\n|\r|\[/g, '').split(']');
                            tenant2_titles.push(warning_msgs[0]);
                            tenant2_values.push(warning_msgs[1].replace(/\./g, '.\n      '));
                        } else {        // 항목 값
                            tenant2_values.push($(this).text().trim());
                        }
                    }
                });
            });

            //console.log('@@@@@@@@@@@@@@@@@@@@tenant2_titles : ', tenant2_titles);
            //console.log('@@@@@@@@@@@@@@@@@@@@tenant2_values : ', tenant2_values);

            for(var i=0; i<tenant2_titles.length; i++) {
                console.log('[' + tenant2_titles[i] + ']\n', '      ' + tenant2_values[i]);
                auction_info.tenant2_infos.push('[' + tenant2_titles[i] + ']\n' + '      ' + tenant2_values[i]);
            }

            console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');

            console.log('--------------------------------------------------------------------------------------------------------------');
            

            console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@', $('title').text().substr(0, 10).replace('타경', '-'));
            console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^', JSON.stringify(auction_info));

            var fileName = $('title').text().substr(0, 10).replace('타경', '-');

            commonFunc.writeFile(fileName, JSON.stringify(auction_info));
        }).catch(function (err) {
            console.log(err);
        });
    }
});
const client = require('cheerio-httpcli');
const fs = require('fs');

client.set('headers', {
    lang : 'euc-kr'
})

const searchSiteURL = "http://landfuture.co.kr/workdir/upcate/kyg/kyg_srch.php";
const searchCondition = {
    tt1 : '1',
    sub_menu_name : '종합검색',
    search_type : 'detail',
    FIELD_CATE : '경매',
    fcate : 'kyg',
    SW_KYUNG_ING : '1',
    form_name : 'kyg_srch_frm',
    SAVE_SRCH_OPT : 'Y',
    pg : '1',
    SUB_CATE : 'kyg_all_srch',
    s_year : '전체',
    sido : '서울',
    gugun : '마포구',
    menu_srch_bt : '지도검색',
    s_date_from : '2019.04.08',
    s_date_to : '2019.04.30',
    easy_srch : '지역/건물명',
    list_limit : '5개씩'
}
const detailViewURL = "http://landfuture.co.kr/workdir/upcate/kyg/kyg_dview.php";
/*
const detailPageCallParams = {
    Cc : '000215',
    Sn : '20180130000424',
    Rn : '1',
    Rty_Status : '매각',
    pg_tp : 'pop'
}
*/
var detailPageCallParams = [];

client.fetch(searchSiteURL, searchCondition, function(err, $, res, result) {
    
    $('tr.kyg_list_style').each(function (idx) {
        var dParams = $(this).attr('onclick').replace('rlty_new_view(', '').replace(');', '').replace(/\'/g, '').split(',');
        console.log('dParams', dParams);

        $('#rlty_detail_frm').attr("action", "/workdir/upcate/kyg/kyg_dview.php");

        var detailPageContent = $('#rlty_detail_frm').submitSync({
            Cc : dParams[2],
            Sn : dParams[3],
            Rn : dParams[4],
            Rty_Status : dParams[5],
            pg_tp : dParams[1],
            MAIN_CATE : 'web'
        });
        var saveFileName = "auction_item_" + dParams[3] + ".html";
        console.log('saveFileName', saveFileName);
        fs.writeFileSync('./html_down/' + saveFileName, detailPageContent.$.html());
        //console.log(detailPageContent.$('span').text());
    });
});

/*
function arrayToObject(arr) {
    var obj = {};
    var pTitle = ['f_ct', 'pg_tp', 'cc', 'sn', 'rn', 'Rty_Status', 'other_v', 'From_Which_Section'];
    for (var i=0; i < arr.length; i++) {
        obj[pTitle[i]] = arr[i];
    }
    return obj;
}
*/
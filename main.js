const client = require('cheerio-httpcli');
const fs = require('fs');

client.set('headers', {
    lang : 'euc-kr'
})

const searchSiteURL = "http://landfuture.co.kr/workdir/upcate/kyg/kyg_srch.php";
const searchCondition = {
    /*
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
    s_date_from : '2019.04.15',
    s_date_to : '2019.05.30',
    easy_srch : '지역/건물명',
    list_limit : '10개씩'
    */
	tt1 : '1',
	sub_menu_name : '종합검색',
	search_type : 'detail',
	search_tab : '',
	rlty_list_view_type : '',
	add_search_option : '',
	FIELD_CATE : '경매',
	rtp : '',
	Blog_Auto : '',
	recom_kind : '',
	fcate : 'kyg',
	SW_KYUNG_ING : '1',
	recom_action_type : '',
	recom_field_cate : '',
	form_name : 'kyg_srch_frm',
	NeedForSrch_Flag : '',
	SAVE_SRCH_OPT : 'Y',
	quick_srch : '',
	pg : '1',
	fsubcate : '',
	car_nm : '',
	car_manufacture_nm : '',
	car_model : '',
	car_nation : '',
	blog_corp_ct : '',
	tk_pid : '',
	recom_sub_kind : '',
	SUB_CATE : 'kyg_all_srch',
	SW_KYUNG_ING : '',
	court : '',
	s_year : '전체',
	s_sa_num : '',
	sido : '대전',
	gugun : '',
	dong : '',
	s_date_from : '2019.04.24',
	s_date_to : '2019.06.24',
	easy_srch : '지역/건물명',
	eva_amt_from : '',
	eva_amt_to : '',
	min_amt_from : '',
	min_amt_to : '',
	bldg_area_from : '',
	bldg_area_to : '',
	land_area_from : '',
	land_area_to : '',
	void_cnt_from : '',
	void_cnt_to : '',
	auction_cate : '',
	p_interested : '',
	ord_w_1 : '',
	ord_w_2 : '',
	appt_status1 : '신건',
	appt_status2 : '유찰',
	appt_status3 : '진행',
	appt_status14 : '재진행',
	rltyct1 : '아파트',
	rltyct2 : '주택',
	rltyct3 : '연립',
	rltyct4 : '다세대',
	rltyct5 : '다가구',
	rltyct6 : '근린주택',
	rltyct7 : '오피스텔',
	rltyct9 : '근린생활시설',
	rltyct10 : '근린상가',
	rltyct11 : '상가',
	rltyct12 : '점포',
	rltyct17 : '사무실',
	rltyct19 : '아파트상가',
	rltyct22 : '대지',
	rltyct23 : '임야',
	list_limit : '100개씩',
	tmenu_orderby : ''   
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
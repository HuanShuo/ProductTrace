/**
 * Created by zxy on 2016/11/15.
 */
jQuery(document).ready(function(){
    var $countyGroup1 = $('.listGroup1').find('a');
    var $countyGroup2 = $('.listGroup2').find('a');
    var $tips = $('#tips').find('li');
    var $entTable = $('#entTable');
    var $totalProNum = $('#totalProNum');
    var $totalOnlineNum = $('#totalOnlineNum');
    var $totalSpeNum = $('#totalSpeNum');
    var $totalBatchNum = $('#totalBatchNum');
    var $totalStockNum = $('#totalStockNum');

    var barOption = {
        title:{
            text:'',
            subtext: '',
            x:'right',
            y:'top'
        },
        tooltip : {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        legend: {
            data:[],
            x:'430px'
        },
        grid: {
            show:true,
            x:'5px',
            y:'50px',
            x2:'30px',
            y2:'40px',
            containLabel: true
        },
        dataZoom:[{
            type:'slider',
            handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
            handleSize: '60%',
            handleStyle: {
                color: '#fff',
                shadowBlur: 3,
                shadowColor: 'rgba(0, 0, 0, 0.6)',
                shadowOffsetX: 2,
                shadowOffsetY: 2
            },
            showDetail:false,
            realtime:true,
            start:1,
            end:100,
        }
        ],
        xAxis : [
            {
                type : 'category',
                data : [],
                boundaryGap : true,
                axisTick: {onGap:false},
                splitLine: {show:false},
                scale:true,
            }
        ],
        yAxis : [
            {
                type : 'value',
                name : '统计数量'
            }
        ],
        series : [
            {
                type : 'category',
                data : [],
                boundaryGap : true,
                axisTick: {onGap:false},
                splitLine: {show:false},
                scale:true,
                itemStyle: {
                    normal: {
                        color: '#1AB385',
                        areaStyle:{
                            color:'#1AB385'
                        }
                    }
                },
            }
        ]
    };
    var barOptionGroup2 = {
        title:{
            text:"产品合格率统计",
            subtext: '按产品类型划分',
            x:'right',
            y:'top'
        },
        tooltip : {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        legend: {
            data:[],
            x:'430px'
        },
        grid: {
            show:true,
            x:'5px',
            y:'50px',
            x2:'30px',
            y2:'40px',
            containLabel: true
        },
        xAxis : [
            {
                type : 'category',
                data : [],
                boundaryGap : true,
                axisTick: {onGap:false},
                splitLine: {show:false},
                scale:true,
            }
        ],
        yAxis : [
            {
                type : 'value',
                name : '合格率',
                min:'0%',
                max:'100%'
            }
        ],
        dataZoom:[{
            type:'slider',
            handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
            handleSize: '60%',
            handleStyle: {
                color: '#fff',
                shadowBlur: 3,
                shadowColor: 'rgba(0, 0, 0, 0.6)',
                shadowOffsetX: 2,
                shadowOffsetY: 2
            },
            showDetail:false,
            realtime:true,
            start:1,
            end:100,
        }
        ],
        series : [
            {
                name:'合格率',
                type:'line',
                smooth:true,
                symbol:'none',
                sampling:'average',
                itemStyle: {
                    normal: {
                        color: 'rgba(255, 70, 131,0.6)',
                        areaStyle:{
                            color:'#f90',
                            type:'default',
                        }
                    }
                },
                data:[],
                barWidth :25,
                barGap:'5%',
                smooth:true,
            }
        ]
    };
    var reqDatas = {
        //请求企业列表的数据地址
        comListUrl:'/index.php/productTrace/Ent/?region=',
        //请求柱状图的url
        getBarsUrl:function(classify){
            return '/index.php/productTrace/'+classify;
        },
        //请求撒点列表的数据地址
        getMarksUrl:function(region){
            return '/index.php/productTrace/Ent/?region='+region;
        },
        //请求合格率数据
        getPassUrl:function(){
            return '/index.php/product/inspect/json';
        },
        //请求产品效益统计
        getBenefitUrl:function(){
            return '/index.php/product/market/json';
        },
        //请求品种占有率
        getOccupyUrl:function(){
            return '/index.php/product/price/json';
        },
        //请求总体态势数据
        getGlobalUrl:function(){
            return '/index.php/product/index/chart';
            //return 'http://localhost:8080/FoodTracing/state01';
        }
    };
    /**
     * 描述：
     * 1.企业列表数据请求；
     * 2.首页柱状图数据请求、参数设置、图表展示、echarts实例化；
     * 3.首页总体态势数据请求；
     * @type {{comListRequest: comFuc.comListRequest, ajaxBarRequest: comFuc.ajaxBarRequest, changeOption: comFuc.changeOption, showBar: comFuc.showBar, barInit: comFuc.barInit, newEchart: comFuc.newEchart}}
     */
    var comFuc = {
        stateData:{},
        comListRequest:function(domEle,county){
            domEle.bootstrapTable('refresh', {
                url:reqDatas.comListUrl+encodeURIComponent(county),
                dataType:'jsonp'
            });
        },
        ajaxBarRequest:function(url,classData){
            $.ajax({
                url:url,
                dataType:'jsonp',
                type:'post',
                success:function(msg){
                    comFuc.showBar(msg,classData);
                },
                error:function(){
                    console.log('error');
                }
            });
        },
        ajaxGlobalRequest:function (url) {
            $.ajax({
                url:url,
                dataType:'jsonp',
                type:'post',
                success:function(msg){
                    comFuc.changeGlobalData(msg);
                },
                error:function(){
                    console.log('error');
                }
            })
        },
        changeOption:function(opt,name,eleJson){
            barOption.legend.data = [];
            barOption.xAxis[0].data = [];
            barOption.series[0].data =[];
            barOption.series[0].type=[];
            barOption.series[0].itemStyle.normal = [];
            barOption.title.text = eleJson.title;
            barOption.title.subtext = eleJson.subText;
            barOption.yAxis[0].name = eleJson.yAxisName;
            barOption.series[0].type = eleJson.type;
            barOption.series[0].itemStyle.normal = eleJson.normal;
            if(name == 'dataCounty'){
                for(var i = 0; i<opt.length;i++){
                    barOption.legend.data.push(opt[i].county);
                    barOption.xAxis[0].data.push(opt[i].county);
                    barOption.series[0].data.push(opt[i].entNum);
                };
            }else if(name == 'dataCate'.trim()){
                for(var i = 0; i<opt.length;i++){
                    barOption.legend.data.push(opt[i].cate);
                    barOption.xAxis[0].data.push(opt[i].cate);
                    barOption.series[0].data.push(opt[i].entNum);
                };
            }else if(name == 'dataPass'){
                for(var i = 0; i<opt.length;i++){
                    barOption.legend.data.push(opt[i].ProductDateTime);
                    barOption.xAxis[0].data.push(opt[i].ProductDateTime);
                    barOption.series[0].data.push(opt[i].QualifiedRate);
                };
            }else if(name == 'dataBenefit'){
                for(var i = 0; i<opt.length;i++){
                    barOption.legend.data.push(opt[i].EntName);
                    barOption.xAxis[0].data.push(opt[i].EntName);
                    barOption.series[0].data.push(opt[i].rate);
                };
            }else if(name == 'dataOccupy'){
                for(var i = 0; i<opt.length;i++){
                    barOption.legend.data.push(opt[i].EntName);
                    barOption.xAxis[0].data.push(opt[i].EntName);
                    barOption.series[0].data.push(opt[i].Price);
                };
            }else{
                return
            };
            return barOption;
        },
        changeGlobalData:function(data){
            var dataArray = [$totalProNum.html(),$totalOnlineNum.html(),$totalSpeNum.html(),$totalBatchNum.html(),$totalStockNum.html()];
            (dataArray[0]!=data.productionNum)?$totalProNum.html(data.productionNum).addClass('animated pulse'):function(){return};
            (dataArray[1]!=data.entNum)?$totalOnlineNum.html(data.entNum).addClass('animated pulse'):function(){return};
            (dataArray[2]!=data.productTypeNum)?$totalSpeNum.html(data.productTypeNum).addClass('animated pulse'):function(){return};
            (dataArray[3]!=data.productBatNum)?$totalBatchNum.html(data.productBatNum).addClass('animated pulse'):function(){return};
            (dataArray[4]!=data.productResNum)?$totalStockNum.html(data.productResNum).addClass('animated pulse'):function(){return};
        },
        showBar:function(opt,name){
            if(name == 'dataCounty'){
                comFuc.changeOption(opt,name,{
                    title:'溯源平台企业数量统计',
                    subText:'按区域统计',
                    yAxisName:'企业数量',
                    type:'bar'
                });
            }else if(name == 'dataCate'.trim()){
                comFuc.changeOption(opt,name,{
                    title:'溯源平台企业数量统计',
                    subText:'按产品类型统计',
                    yAxisName:'企业数量',
                    type:'bar'
                });
            }else if(name == 'dataPass'){
                comFuc.changeOption(opt,name,{
                    title:'企业产品合格率统计',
                    subText:'',
                    yAxisName:'合格率',
                    type:'line',
                    normal:{
                        color:'',
                        areaStyle:{
                            color:'#f90',
                        }
                    },
                });
            }else if(name == 'dataBenefit'){
                comFuc.changeOption(opt,name,{
                    title:'企业市场占有率',
                    subText:'',
                    yAxisName:'占有率',
                    type:'bar',
                });
            }else if(name == 'dataOccupy'){
                comFuc.changeOption(opt,name,{
                    title:'企业产值统计',
                    subText:'',
                    yAxisName:'产值',
                    type:'bar',
                });
            }else{
                return
            }
            comFuc.newEchart(name).setOption(barOption);
        },
        barInit:function(){
            comFuc.ajaxBarRequest(reqDatas.getBarsUrl('county'),'dataCounty');
        },
        newEchart:function(eleEchart){
            return echarts.init(document.getElementById(eleEchart));
        }
    };
    $countyGroup1.on({
        'click':function(){
            var countyName = $(this).html();
            //切换列表
            if(countyName == '运城市'){
                $('#indexMain').fadeOut(100);
                $('#indexMain').fadeIn(1000);
            }else if(countyName == '河津市'){
                $('#indexMain').fadeOut(100);
                $('#districtPage').fadeIn(1000);
                comFuc.comListRequest($entTable,countyName);
            }else if(countyName == '盐湖区'){
                $('#indexMain').fadeOut(100);
                $('#districtPage').fadeIn(1000);
                comFuc.comListRequest($entTable,countyName);
            }else if(countyName == '永济市'){
                $('#indexMain').fadeOut(100);
                $('#districtPage').fadeIn(1000);
                comFuc.comListRequest($entTable,countyName);
            }else if(countyName == '稷山县'){
                $('#indexMain').fadeOut(100);
                $('#districtPage').fadeIn(1000);
                comFuc.comListRequest($entTable,countyName);
            }else if(countyName == '万荣县'){
                $('#indexMain').fadeOut(100);
                $('#districtPage').fadeIn(1000);
                comFuc.comListRequest($entTable,countyName);
            }else if(countyName == '临猗县'){
                $('#indexMain').fadeOut(100);
                $('#districtPage').fadeIn(1000);
                comFuc.comListRequest($entTable,countyName);
            }else if(countyName == '闻喜县'){
                $('#indexMain').fadeOut(100);
                $('#districtPage').fadeIn(1000);
                comFuc.comListRequest($entTable,countyName);
            }else if(countyName == '新绛县'){
                $('#indexMain').fadeOut(100);
                $('#districtPage').fadeIn(1000);
                comFuc.comListRequest($entTable,countyName);
            }else if(countyName == '平陆县'){
                $('#indexMain').fadeOut(100);
                $('#districtPage').fadeIn(1000);
                comFuc.comListRequest($entTable,countyName);
            }else if(countyName == '芮城县'){
                $('#indexMain').fadeOut(100);
                $('#districtPage').fadeIn(1000);
                comFuc.comListRequest($entTable,countyName);
            }else if(countyName == '夏县'){
                $('#indexMain').fadeOut(100);
                $('#districtPage').fadeIn(1000);
                comFuc.comListRequest($entTable,countyName);
            }else if(countyName == '绛县'){
                $('#indexMain').fadeOut(100);
                $('#districtPage').fadeIn(1000);
                comFuc.comListRequest($entTable,countyName);
            }else{
                return;
            };
        }
    });
    $tips.on('mouseenter',function(){
        if($(this).index() == 0){
            $('#dataCounty').show().siblings().hide();
            comFuc.ajaxBarRequest(reqDatas.getBarsUrl('county'),'dataCounty');
        }else if($(this).index() == 1){
            $('#dataCate').show().siblings().hide();
            comFuc.ajaxBarRequest(reqDatas.getBarsUrl('Cate'),'dataCate');
        }else if($(this).index() == 2){
            $('#dataPass').show().siblings().hide();
            comFuc.ajaxBarRequest(reqDatas.getPassUrl(),'dataPass');
        }else if($(this).index() == 3){
            $('#dataBenefit').show().siblings().hide();
            comFuc.ajaxBarRequest(reqDatas.getBenefitUrl(),'dataBenefit');
        }else if($(this).index() == 4){
            $('#dataOccupy').show().siblings().hide();
            comFuc.ajaxBarRequest(reqDatas.getOccupyUrl(),'dataOccupy');
        }
    });
    //初始化柱状图
    comFuc.barInit();
    //定时请求总体态势数据
    comFuc.ajaxGlobalRequest(reqDatas.getGlobalUrl());
    // window.setInterval(function(){
    //     $totalProNum.removeClass();$totalOnlineNum.removeClass();$totalSpeNum.removeClass();$totalBatchNum.removeClass();$totalStockNum.removeClass();
    //     comFuc.ajaxGlobalRequest(reqDatas.getGlobalUrl());
    // },2000);
    // window.setInterval(function(){
    //     comFuc.ajaxGlobalRequest(reqDatas.getGlobalUrl());
    // },1000);
    // comFuc.ajaxGlobalRequest(reqDatas.getGlobalUrl());
})
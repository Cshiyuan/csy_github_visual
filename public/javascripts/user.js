/**
 * Created by chenshyiuan on 2017/5/3.
 */
    // 基于准备好的dom，初始化echarts实例
    //第一个图表
var myChart = echarts.init(document.getElementById('main'));
var option = {};
myChart.setOption(option);
myChart.showLoading();

$.ajax({
    type: "get",
    async: false, //同步执行
    url: "/api/checkReposWatchersWithCount",
    dataType: "json", //返回数据形式为json
    data: {rnd: Math.random()},
    success: function (result) {
        if (result) {
            series = {
                name: '库的watchers',
                type: 'pie',
                radius: '55%'
            };
            series.data = result;
            option.series = series;
            option.title = {
                text: "库的watcher数量占比",
                left: 'center'
            };
            myChart.hideLoading();
            myChart.setOption(option);
        }
    },
    error: function (errorMsg) {
        alert("图表请求数据失败啦!");
    }
});
// 指定图表的配置项和数据


//第二个图表
var myChartTwo = echarts.init(document.getElementById('mainTwo'));
var optionTwo = {};
myChartTwo.setOption(optionTwo)
myChartTwo.showLoading();

$.ajax({
    type: "get",
    async: false, //同步执行
    url: "/api/checkReposLanguageWithCount",
    dataType: "json", //返回数据形式为json
    data: {rnd: Math.random()},
    success: function (result) {
        if (result) {
            optionTwo = {
                title: {
                    text: '不同语言的库数量',
                    left: 'center'
                },
                tooltip: {},
                legend: {
                    data: ['不同语言的库数量']
                },
                xAxis: {
//                        data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
                },
                yAxis: {},
                series: [{
                    name: '语言库数量',
                    type: 'bar',
//                        data: [5, 20, 36, 10, 10, 20]
                }]
            };
            dataNameArray = [];
            dataValueArray = [];
            for (var i = 0; i < result.length; i++) {
                dataNameArray.push(result[i]._id);
                dataValueArray.push(result[i].count);
            }
            optionTwo.series[0].data = dataValueArray;
            optionTwo.xAxis.data = dataNameArray;
            myChartTwo.hideLoading();
            myChartTwo.setOption(optionTwo);
        }
    },
    error: function (errorMsg) {
        alert("图表请求数据失败啦!");
    }
});
var chart;

var monthMapper = {
    1:"Jan",
    2:"Feb",
    3:"Mar",
    4:"Apr",
    5:"May",
    6:"Jun",
    7:"Jul",
    8:"Aug",
    9:"Sep",
    10:"Oct",
    11:"Nov",
    12:"Dec"
};

var reverseMonthMapper = {
    "Jan":1,
    "Feb":2,
    "Mar":3,
    "Apr":4,
    "May":5,
    "Jun":6,
    "Jul":7,
    "Aug":8,
    "Sep":9,
    "Oct":10,
    "Nov":11,
    "Dec":12
};

var chartOptions =  {
    credits: false,
    //colors: ["#666666"],
    colors: ["#43C7BC"],
    
    chart: {
        renderTo: 'chartDiv',
        type: 'column'
    },
    title: {
        text: '',
        style: {
         color: '#000',
         //textTransform: 'uppercase',
         fontSize: '14px'
      }
    },
    xAxis: {
        type: 'category',
        labels: {
            rotation: -45,
            align: 'right',
            style: {
                fontSize: '10px',
                fontFamily: 'Verdana, sans-serif'
            }
        }
    },
    yAxis: {
        min: 0,
        title: {
            text: ''
        }
    },
    legend: {
        enabled: false
    },
    tooltip: {
        //pointFormat: 'Results: <b>{point.y:.1f} docs</b>'
        pointFormat: '<b>{point.y} docs</b>'
    },
    dataLabels: {
        enabled: true,
        rotation: -90,
        color: '#FFFFFF',
        align: 'right',
        x: 4,
        y: 10,
        style: {
            fontSize: '11px',
            fontFamily: 'Verdana, sans-serif',
            textShadow: '0 0 3px black'
        }
    },
    plotOptions: {
        series: {
            cursor: 'pointer',
            point: {
                events: {
                    click: function() {
                        //alert ('Name: '+ this.name +', value: '+ this.y);
                        graphOnClick({gap:gap,label:this.name})
                    }
                }
            }
        }
    },
    series: [{
        name: 'Results',
        data: [
            /*['Mexico City', 8.9],
            ['Lima', 8.9]*/
        ]

    }]
}



function initChart() {

    chart = new Highcharts.Chart(chartOptions);
}

function updateChart(data) {
    chartOptions.series[0].data = data;
    chart = new Highcharts.Chart(chartOptions);   
}


function getChartGap() {
    //get gap based on plugin date
    var dates = getPluginDates();
    var start = dates.start;
    var end = dates.end;

    if(start.year != end.year) {
        return "+1YEAR/YEAR";
    } else if(start.month != end.month) {
        return "+1MONTH/MONTH";
    } else if(start.day != end.day) {
        return "+1DAY/DAY";
    } else if(start.hour != end.hour) {
        return "+1HOUR/HOUR";
    } else if(start.min != end.min) {
        return "+1MINUTE/MINUTE";
    } else {
        return "1YEAR/YEAR";
    }

}

var graphData = [],gap;

function populateChart(params) {
    
    
    chart.hideLoading();

    gap = params['gap'];

    var solrData = params['counts'];
   // console.log(solrData);

    if(solrData.length == 0) {
        //TODO - clear the graph
        return;
    }

    var dates = getPluginDates();

    graphData= [];


    var tempHash = {};

    if(gap.match(/YEAR/)) {

        var startYear = dates.start.year;
        var endYear = dates.end.year;

        while(startYear<=endYear) {
            tempHash[startYear.toString()]  = 0;
            startYear++;
        }
        
        for(var i=0;i<solrData.length;i=i+2){
            var value = solrData[i];
            var year = value.replace(/\-.*/,'');
            var count = solrData[i+1];
        
            tempHash[year.toString()] = count;
        }

        chartOptions['title']['text'] = "";
        
    } else if(gap.match(/MONTH/)) {

        var startYear = dates.start.year;
        for(var i=1;i<=12;i++) {
            tempHash[startYear+"-"+monthMapper[i]] = 0;
        }

        for(var i=0;i<solrData.length;i=i+2){
            var value = solrData[i];
            var year = getComponentsFromSolrDate(value)['year'];
            var month = monthMapper[+(getComponentsFromSolrDate(value)['month'])];

            var count = solrData[i+1];
        
            tempHash[startYear+"-"+month] = count;
        }

        chartOptions['title']['text'] = "";

    } else if(gap.match(/DAY/)) {
        
        var startYear = dates.start.year;
        var startMonth = dates.start.month;
        
        for(var i=1;i<=daysInMonth(startYear,+startMonth);i++) {
            tempHash[startYear + "-" + monthMapper[+startMonth] + "-" + pad(i)] = 0;
        }

        for(var i=0;i<solrData.length;i=i+2){
            var value = solrData[i];
            var year = getComponentsFromSolrDate(value)['year'];
            var month = monthMapper[+(getComponentsFromSolrDate(value)['month'])];
            var day = getComponentsFromSolrDate(value)['day'];

            var count = solrData[i+1];
        
            tempHash[startYear+"-"+month + "-" + day] = count;
        }        

        chartOptions['title']['text'] = "";

    } else if(gap.match(/HOUR/)) {

        var startYear = dates.start.year;
        var startMonth = dates.start.month;
        var startDay = dates.start.day;
        
        for(var i=0;i<=23;i++) {
            tempHash[pad(i) + ":00"] = 0;
        }

        
        for(var i=0;i<solrData.length;i=i+2){
            var value = solrData[i];
           
            var hour = getComponentsFromSolrDate(value)['hour'];
            var count = solrData[i+1];
        
            tempHash[pad(+hour) + ":00"] = count;
        }    

         chartOptions['title']['text'] = "Hourly view of " + startYear + "-" + monthMapper[+startMonth] + "-" + pad(startDay);

    } else if(gap.match(/MINUTE/)) {

        var startYear = dates.start.year;
        var startMonth = dates.start.month;
        var startDay = dates.start.day;
        var startHour = dates.start.hour;
        
        for(var i=0;i<=59;i++) {
            tempHash[startHour + ":" + pad(i)] = 0;
        }

        
        for(var i=0;i<solrData.length;i=i+2){
            var value = solrData[i];
           
            var min = getComponentsFromSolrDate(value)['min'];
            var count = solrData[i+1];
        
            tempHash[startHour + ":" + pad(+min)] = count;
        }    

        chartOptions['title']['text'] = "Minutes view of " + startYear + "-" + monthMapper[+startMonth] + "-" + pad(startDay) + " - " + startHour + ":00 hour" ;
    } 



    graphData = hashToArray(tempHash);
    // chart.series[0].setData(graphData,true);
    updateChart(graphData);

}


function getComponentsFromSolrDate(solrDate) {

    var comp = solrDate.match(/(\d+)\-(\d+)-(\d+)T(\d+):(\d+):(\d+)Z/);
    return({
        year: comp[1],
        month: comp[2],
        day: comp[3],
        hour: comp[4],
        min: comp[5],
        sec: comp[6]
    });


}


function hashToArray(tempHash) {
    var arr = [];
    $.each(tempHash,function(key,value) {
        arr.push([key,+value]);
    });
    return arr;
}

function getPluginDates() {

    var dates = {};
    var startDate = $('#start-date-div').val();
    var endDate = $('#end-date-div').val();

    var comp = startDate.match(/(\d+)\-(\d+)-(\d+) (\d+):(\d+)/);

    dates['start'] = {
        year: comp[1],
        month: comp[2],
        day: comp[3],
        hour: comp[4],
        min: comp[5],
        sec: "00",
        fullDate: startDate,
        solrDate: startDate.replace(/\s/,'T') + ':00Z'
    }


    comp = endDate.match(/(\d+)\-(\d+)-(\d+) (\d+):(\d+)/);

    dates['end'] = {
        year: comp[1],
        month: comp[2],
        day: comp[3],
        hour: comp[4],
        min: comp[5],
        sec: "59",
        fullDate: endDate,
        solrDate: endDate.replace(/\s/,'T') + ':59Z'
    }

    return dates;
}



function graphOnClick(params) {
    //var gap = params.gap;

    $('#clearTime').show();

    var label = params.label;
    
    var startDate,endDate;
    if(gap.match(/YEAR/)) {
        startDate = label + "-01-01 00:00";
        endDate = label + "-12-31 23:23";

    }  else if(gap.match(/MONTH/)) {

        var year = label.replace(/\-.*/,'');
        var month = pad(reverseMonthMapper[label.replace(/.*\-/,'')]);

        startDate = year + "-" + month + "-01 00:00";
        endDate = year + "-" + month + "-31 23:59";

    } else if(gap.match(/DAY/)) {

        var year = label.match(/(\d+)\-(\w+)\-(\d+)/)[1];
        var month = pad(reverseMonthMapper[label.match(/(\d+)\-(\w+)\-(\d+)/)[2]]);
        var day = label.match(/(\d+)\-(\w+)\-(\d+)/)[3];

        startDate = year + "-" + month + "-" + day + " 00:00";
        endDate = year + "-" + month + "-" + day + " 23:59";


    } else if(gap.match(/HOUR/)) {
        
        //in this case label will be HH:MM like 23:00
        var hour = label.replace(/:.*/,'');

        //change default label, get year, month and day from chart title
        label =  chartOptions['title']['text'].replace("Hourly view of ");
        var year = label.match(/(\d+)\-(\w+)\-(\d+)/)[1];
        var month = pad(reverseMonthMapper[label.match(/(\d+)\-(\w+)\-(\d+)/)[2]]);
        var day = label.match(/(\d+)\-(\w+)\-(\d+)/)[3];


        startDate = year + "-" + month + "-" + day + " " + hour + ":00";
        endDate = year + "-" + month + "-" + day + " " + hour + ":59";

    } else {
        $('#error-notification').html("<b>[Invalid Operation]:</b> You cannot drilldown any further. You are already vieweing chart in deepest MINUTE view.");
        $('#error-notification').miniNotification();
        return;
    }

    changeDateInPlugin({startDate:startDate, endDate:endDate});

    startSearch();

}



function pad(i) {
    i = +i;
    if(i>=10) {
        return i.toString();
    } else {
        return "0" + i.toString();
    }

}


function daysInMonth(year, month) {
    return new Date(year, month, 0).getDate();
}
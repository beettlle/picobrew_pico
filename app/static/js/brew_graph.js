Highcharts.setOptions({
    time: {
        useUTC: false
    }
});

function initiatizeChart(graph_data) {
  Highcharts.chart(graph_data.chart_id, {
    chart: {
      type: 'spline',
      zoomType: 'xy'
    },

    credits: {
      enabled: false
    },

    colors: ['#39F', '#F0F', '#FF6', '#F00', '#6C5', '#000'],

    plotOptions: {
      spline: {
        marker: {
          enabled: true
        }
      }
    },

    title: graph_data.title,

    subtitle: graph_data.subtitle,

    tooltip: {
      formatter: function() {
          const chart = this.points[0].series.chart;

          var s = '<b>'+ Highcharts.dateFormat('%A, %b %e %k:%M:%S.%L', // Friday, Jan ## ##:##:##.####
            new Date(this.x)) +'</b>';

          if (chart.pauseReason) {
              s += `<br/><span style="color:red; font-size: 18px;">${chart.pauseReason.toUpperCase()}</span>`
          }

          $.each(this.points, function(i, point) {
              s += '<br/><span style="color:' + point.color + '">\u25CF</span> ' + point.series.name + ': ' + point.y;
          });

          return s;
      },
      shared: true
    },

    xAxis: {
      type: 'datetime',
      title: {
        text: 'Time'
      },
      plotLines: graph_data.xaplotlines.map(plotLine => {
        plotLine.width = 2;
        plotLine.label.style = {'color': 'white', 'fontWeight': 'bold'};
        plotLine.label.verticalAlign = 'top';
        plotLine.label.x = -15;
        plotLine.label.y = 0;
        return plotLine;
      }),
      plotBands: graph_data.xaplotbands.map(plotBand => {
        plotBand.color = 'rgba(255, 86, 48, .2)';
        if (plotBand.label.text.includes('pause')) {
          plotBand.label.style = {'color': 'yellow', 'fontWeight': 'bold'};
        } else {
          plotBand.label.style = {'color': 'red', 'fontWeight': 'bold'};
        }
        plotBand.events = {
          mouseover: function(e) {
            const chart = this.axis.chart;
            chart.pauseReason = this.options.label.text;
          },
          mouseout: function(e) {
            const chart = this.axis.chart;
            chart.pauseReason = null;
          }
        };
        return plotBand;
      })
    },

    yAxis: {
      title: {
        text: 'Temperature (F)'
      },
      min: 0
      //max: 230
    },

    series: graph_data.series,
  });
}

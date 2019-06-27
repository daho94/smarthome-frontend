<template>
    <!-- <base-chart :options="chartOptions"></base-chart> -->
    <div id="container" style="max-width: 800px; min-width: 380px; height: 310px; margin: 0 auto">
    <!-- <div style="margin-top: 100px; text-align: center" id="loading">
        <i class="fa fa-spinner fa-spin"></i> Loading data from external source
    </div> -->
</div>
</template>
<script>
import BaseChart from './BaseChart'
import each from 'lodash/each'
import Highcharts from 'highcharts';
import windbarbInit from 'highcharts/modules/windbarb'
import SubscriptionMixin from '../mixins/subscription-mixin'

windbarbInit(Highcharts)

function Meteogram(container, states) {
    // Parallel arrays for the chart data, these are populated as the XML/JSON file
    // is loaded
    this.symbols = [];
    this.precipitations = [];
    this.precipitationsError = []; // Only for some data sets
    this.winds = [];
    this.temperatures = [];
    this.pressures = [];
    this.windSymbols = [];
    this.states = states;
    this.resolution = 3600000;
    // Initialize
    this.container = container;

    // Run
    this.parseYrData();
}

/**
 * Function to smooth the temperature line. The original data provides only whole degrees,
 * which makes the line graph look jagged. So we apply a running mean on it, but preserve
 * the unaltered value in the tooltip.
 */
Meteogram.prototype.smoothLine = function (data) {
    var i = data.length,
        sum,
        value;

    while (i--) {
        data[i].value = value = data[i].y; // preserve value for tooltip

        // Set the smoothed value to the average of the closest points, but don't allow
        // it to differ more than 0.5 degrees from the given value
        sum = (data[i - 1] || data[i]).y + value + (data[i + 1] || data[i]).y;
        data[i].y = Math.max(value - 0.5, Math.min(sum / 3, value + 0.5));
    }
};

/**
 * Function to convert a compass direction to a number of degrees
 */
Meteogram.prototype.windDirToDeg = function (dir) {
    let deg = undefined
    switch (dir) {
        case "N": 
            deg = 360
            break
        case "NE":
            deg = 45
            break
        case "NW":
            deg = 315
            break
        case "E":
            deg = 90
            break
        case "SE":
            deg = 145
            break
        case "S":
            deg = 180
            break
        case "SW":
            deg = 235
            break
        case "W":
            deg = 270
            break
        default:
    }
    return deg
}

/**
 * Draw the weather symbols on top of the temperature series. The symbols are
 * fetched from yr.no's MIT licensed weather symbol collection.
 * https://github.com/YR/weather-symbols
 */
Meteogram.prototype.drawWeatherSymbols = function (chart) {
    var meteogram = this;

    each(chart.series[0].data, function (point, i) {
        if (meteogram.resolution > 36e5 || i % 2 === 0) {

            chart.renderer
                .image(
                    'https://cdn.jsdelivr.net/gh/YR/weather-symbols@6.0.2/dist/svg/' +
                        meteogram.symbols[i] + '.svg',
                    point.plotX + chart.plotLeft - 8,
                    point.plotY + chart.plotTop - 30,
                    30,
                    30
                )
                .attr({
                    zIndex: 5
                })
                .add();
        }
    });
};

/**
 * Draw blocks around wind arrows, below the plot area
 */
Meteogram.prototype.drawBlocksForWindArrows = function (chart) {
    var xAxis = chart.xAxis[0],
        x,
        pos,
        max,
        isLong,
        isLast,
        i;

    for (pos = xAxis.min, max = xAxis.max, i = 0; pos <= max + 36e5; pos += 36e5, i += 1) {

        // Get the X position
        isLast = pos === max + 36e5;
        x = Math.round(xAxis.toPixels(pos)) + (isLast ? 0.5 : -0.5);

        // Draw the vertical dividers and ticks
        if (this.resolution > 36e5) {
            isLong = pos % this.resolution === 0;
        } else {
            isLong = i % 2 === 0;
        }
        chart.renderer.path(['M', x, chart.plotTop + chart.plotHeight + (isLong ? 0 : 28),
            'L', x, chart.plotTop + chart.plotHeight + 32, 'Z'])
            .attr({
                stroke: chart.options.chart.plotBorderColor,
                'stroke-width': 1
            })
            .add();
    }

    // Center items in block
    chart.get('windbarbs').markerGroup.attr({
        translateX: chart.get('windbarbs').markerGroup.translateX + 8
    });

};


/**
 * Build and return the Highcharts options structure
 */
Meteogram.prototype.getChartOptions = function () {
    var meteogram = this;

    return {
        chart: {
            renderTo: this.container,
            marginBottom: 70,
            marginRight: 40,
            marginTop: 50,
            plotBorderWidth: 1,
            height: 310,
            alignTicks: false,
            scrollablePlotArea: {
                minWidth: 720
            }
        },

        defs: {
            patterns: [{
                id: 'precipitation-error',
                path: {
                    d: [
                        'M', 3.3, 0, 'L', -6.7, 10,
                        'M', 6.7, 0, 'L', -3.3, 10,
                        'M', 10, 0, 'L', 0, 10,
                        'M', 13.3, 0, 'L', 3.3, 10,
                        'M', 16.7, 0, 'L', 6.7, 10
                    ].join(' '),
                    stroke: '#68CFE8',
                    strokeWidth: 1
                }
            }]
        },
        time: {
            getTimezoneOffset: function() { return new Date().getTimezoneOffset() }
        },
        title: {
            text: "lel",
            align: 'left',
            style: {
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis'
            }
        },

        tooltip: {
            shared: true,
            useHTML: true,
            headerFormat:
                '<small>{point.x:%A, %b %e, %H:%M}</small><br>'
        },

        xAxis: [{ // Bottom X axis
            type: 'datetime',
            tickInterval: 2 * 36e5, // two hours
            minorTickInterval: 36e5, // one hour
            tickLength: 0,
            gridLineWidth: 1,
            gridLineColor: 'rgba(128, 128, 128, 0.1)',
            startOnTick: false,
            endOnTick: false,
            minPadding: 0,
            maxPadding: 0,
            offset: 30,
            showLastLabel: true,
            labels: {
                format: '{value:%H}'
            },
            crosshair: true
        }, { // Top X axis
            linkedTo: 0,
            type: 'datetime',
            tickInterval: 24 * 3600 * 1000,
            labels: {
                format: '{value:<span style="font-size: 12px; font-weight: bold">%a</span> %b %e}',
                align: 'left',
                x: 3,
                y: -5
            },
            opposite: true,
            tickLength: 20,
            gridLineWidth: 1
        }],

        yAxis: [{ // temperature axis
            title: {
                text: null
            },
            labels: {
                format: '{value}°',
                style: {
                    fontSize: '10px'
                },
                x: -3
            },
            plotLines: [{ // zero plane
                value: 0,
                color: '#BBBBBB',
                width: 1,
                zIndex: 2
            }],
            maxPadding: 0.3,
            minRange: 8,
            tickInterval: 1,
            gridLineColor: 'rgba(128, 128, 128, 0.1)'

        }, { // precipitation axis
            title: {
                text: null
            },
            labels: {
                enabled: false
            },
            gridLineWidth: 0,
            tickLength: 0,
            minRange: 10,
            min: 0

        }, { // Air pressure
            allowDecimals: false,
            title: { // Title on top of axis
                text: 'hPa',
                offset: 0,
                align: 'high',
                rotation: 0,
                style: {
                    fontSize: '10px',
                    color: Highcharts.getOptions().colors[2]
                },
                textAlign: 'left',
                x: 3
            },
            labels: {
                style: {
                    fontSize: '8px',
                    color: Highcharts.getOptions().colors[2]
                },
                y: 2,
                x: 3
            },
            gridLineWidth: 0,
            opposite: true,
            showLastLabel: false
        }],

        legend: {
            enabled: false
        },

        plotOptions: {
            series: {
                pointPlacement: 'between'
            }
        },


        series: [{
            name: 'Temperature',
            data: this.temperatures,
            type: 'spline',
            marker: {
                enabled: false,
                states: {
                    hover: {
                        enabled: true
                    }
                }
            },
            tooltip: {
                pointFormat: '<span style="color:{point.color}">\u25CF</span> ' +
                    '{series.name}: <b>{point.value}°C</b><br/>'
            },
            zIndex: 1,
            color: '#FF3333',
            negativeColor: '#48AFE8'
        }, {
            name: 'Precipitation',
            data: this.precipitationsError,
            type: 'column',
            color: 'url(#precipitation-error)',
            yAxis: 1,
            groupPadding: 0,
            pointPadding: 0,
            tooltip: {
                valueSuffix: ' mm',
                pointFormat: '<span style="color:{point.color}">\u25CF</span> ' +
                    '{series.name}: <b>{point.minvalue} mm - {point.maxvalue} mm</b><br/>'
            },
            grouping: false,
            dataLabels: {
                enabled: meteogram.hasPrecipitationError,
                formatter: function () {
                    if (this.point.maxvalue > 0) {
                        return this.point.maxvalue;
                    }
                },
                style: {
                    fontSize: '8px',
                    color: 'gray'
                }
            }
        }, {
            name: 'Precipitation',
            data: this.precipitations,
            type: 'column',
            color: '#68CFE8',
            yAxis: 1,
            groupPadding: 0,
            pointPadding: 0,
            grouping: false,
            dataLabels: {
                enabled: !meteogram.hasPrecipitationError,
                formatter: function () {
                    if (this.y > 0) {
                        return this.y;
                    }
                },
                style: {
                    fontSize: '8px',
                    color: 'gray'
                }
            },
            tooltip: {
                valueSuffix: ' mm'
            }
        }, {
            name: 'Air pressure',
            color: Highcharts.getOptions().colors[2],
            data: this.pressures,
            marker: {
                enabled: false
            },
            shadow: false,
            tooltip: {
                valueSuffix: ' hPa'
            },
            dashStyle: 'shortdot',
            yAxis: 2
        }, {
            name: 'Wind',
            type: 'windbarb',
            id: 'windbarbs',
            color: Highcharts.getOptions().colors[1],
            lineWidth: 1.5,
            data: this.winds,
            vectorLength: 18,
            yOffset: -15,
            tooltip: {
                valueSuffix: ' m/s'
            }
        }]
    };
};

/**
 * Post-process the chart from the callback function, the second argument to Highcharts.Chart.
 */
Meteogram.prototype.onChartLoad = function (chart) {

    // this.drawWeatherSymbols(chart);
    this.drawBlocksForWindArrows(chart);

};

/**
 * Create the chart. This function is called async when the data file is loaded and parsed.
 */
Meteogram.prototype.createChart = function () {
    var meteogram = this;
    this.chart = new Highcharts.Chart(this.getChartOptions(), function (chart) {
        meteogram.onChartLoad(chart);
    });
};

// Meteogram.prototype.error = function () {
//     $('#loading').html('<i class="fa fa-frown-o"></i> Failed loading data, please try again later');
// };

/**
 * Handle the data. This part of the code is not Highcharts specific, but deals with yr.no's
 * specific data format
 */
Meteogram.prototype.parseYrData = function () {

    let meteogram = this,
        states = this.states,
        windDirections = [];

    const moment = require("moment")
    each(states, function(value, key) {
        if (value === null || key === null) {
            return
        }

        let splitted = key.split(".")
        // ts in ms
        let date = moment().startOf("day").add(parseInt(splitted[splitted.length - 2].split("_")[1]), 'hour').unix() * 1000
        switch (splitted[splitted.length - 1]) {
            case "temp_value":
                meteogram.temperatures.push({
                    x: date,
                    y: parseFloat(value.val),
                })
                break
            case "pressure_value":
                meteogram.pressures.push({
                    x: date,
                    y: parseFloat(value.val),
                })
                break
            case "rain_value":
                meteogram.precipitations.push({
                    x: date,
                    y: parseFloat(value.val),
                })
                break
            case "iconURL":
                meteogram.symbols.push(value.val)
                break
            case "windIconURL":
                meteogram.windSymbols.push(value.val)
                break  
            case "wind_value":
                meteogram.winds.push({
                    x: date,
                    value: parseFloat(value.val),
                    direction: "N/A"
                })
                break  
            case "wind_dir":
                windDirections.push(meteogram.windDirToDeg(value.val))
                break
            default:
                // do nothing
        }

    })
    each(meteogram.winds, function(val, idx) {
        val.direction = windDirections[idx]
    })
    // Smooth the line
    this.smoothLine(this.temperatures);

    // Create the chart when the data is loaded
    this.createChart();
};

export default {
    name: "chart-history",
    mixins: [SubscriptionMixin],
    components: {
        BaseChart,
    },
    props: ["objId", "objState", "timeSpan", "plotColor"],
    data () {
        return {
            pressures: [],
            temperatures: [],
            symbols: [],
            precipitations: [],
            winds: [],
            windSymbols: []
        }
    },
    computed: {
        chartOptions: function() {
            return {                   
                title: {
                    text: ""
                },
                subtitle: {
                    text: "",
                    align: "left",
                    floating: false,
                    useHTML: false,
                    tyle: {
                    color: "#ffebee"
                    }
                },
                chart: {
                    type: "areaspline",
                    backgroundColor: "#2d2d2f",
                    zoomType: "x"
                },
                yAxis: {
                    title: {
                        text: null
                    },
                    labels: {},
                    gridLineWidth: 0,
                },
                xAxis: {
                    title: {
                        text: `Last ${this.timeSpan} hour(s)`,
                        reserveSpace: true
                    },
                    alignTicks: true,
                    minorGridLineDashStyle: "Solid",
                    gridLineDashStyle: "Solid",
                    visible: true,
                    labels: {},
                    type: 'datetime',
                    tickPixelInterval: 150
                },
                legend: {
                    layout: "horizontal",
                    enabled: false
                },
                time: {
                    getTimezoneOffset: function() { return new Date().getTimezoneOffset() }
                },
                plotOptions: {
                    series: {
                        color: this.plotColor,
                        marker: {
                            enabled: false
                        }
                    }
                },
                series: [{
                    data: this.chartData,
                }],
                credits: {
                    enabled: false
                },
            }
        }
    },
    methods: {
        getData: async function() {
            let vm = this
            const moment = require("moment")
            let states = await this.getStates("daswetter.0.NextHours.Location_1.Day_1.Hour_*.(temp_value|pressure_value|rain_value|iconURL|windIconURL|wind_value)")
            try {
                each(states, function(value, key) {
                    if (value === null || key === null) {
                        return
                    }

                    let splitted = key.split(".")

                    let date = moment().startOf("day").add(parseInt(splitted[splitted.length - 2].split("_")[1]), 'hour').toString()
                    switch (splitted[splitted.length - 1]) {
                        case "temp_value":
                            vm.temperatures.push({
                                x: date,
                                y: parseFloat(value.val),
                            })
                            break
                        case "pressure_value":
                            vm.pressures.push({
                                x: date,
                                y: parseFloat(value.val),
                            })
                            break
                        case "rain_value":
                            vm.precipitations.push({
                                x: date,
                                y: parseFloat(value.val),
                            })
                            break
                        case "iconURL":
                            vm.symbols.push({
                                x: date,
                                y: parseFloat(value.val),
                            })
                            break
                        case "windIconURL":
                            vm.windSymbols.push({
                                x: date,
                                y: parseFloat(value.val),
                            })
                            break  
                        case "winds_value":
                            vm.winds.push({
                                x: date,
                                y: parseFloat(value.val),
                            })
                            break  
                        default:
                            // do nothing
                    }
                })
            } catch (error) {
                console.error(error)
            }
        }
    },
    async mounted() {
        let states = await this.getStates("daswetter.0.NextHours.Location_1.Day_1.Hour_*.(temp_value|pressure_value|rain_value|iconURL|windIconURL|wind_value|wind_dir)")
        try {
            new Meteogram('container', states);
        } catch (error) {
            console.error(error)
        }

    },
    watch: {

    },
}
</script>

<style>

</style>
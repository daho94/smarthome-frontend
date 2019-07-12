<template>
    <base-chart :options="chartOptions" @onChartLoad="onChartLoad" @onResize="rerender"></base-chart>
</template>
<script>
import BaseChart from './BaseChart'
import each from 'lodash/each'
import Highcharts from 'highcharts';
import windbarbInit from 'highcharts/modules/windbarb'

windbarbInit(Highcharts)

export default {
    name: "chart-meteogram",
    components: {
        BaseChart,
    },
    props: ["data"],
    data () {
        return {
            pressures: [],
            temperatures: [],
            symbols: [],
            precipitations: [],
            precipitationsError: [],
            winds: [],
            iconsRendered: [],
            windsBlocksRendered: [],
            states: undefined,
            resolution: 3600000,
        }
    },
    computed: {
        chartOptions() {
            const vm = this;
            const textColor = "#f8f9fa" // axis labels

            return {
                chart: {
                    plotBorderWidth: 1,
                    alignTicks: false,
                    marginRight: 40,
                    // scrollablePlotArea: {
                    //     mscrollinWidth: 720
                    // }
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
                tooltip: {
                    shared: true,
                    useHTML: true,
                    headerFormat:
                        '<small>{point.x:%A, %b %e, %H:%M} - {point.point.to:%H:%M}</small><br>' +
                        '<b>{point.point.symbolDesc}</b><br>'
                },

                xAxis: [{ // Bottom X axis
                    type: 'datetime',
                    tickInterval: 2 * 36e5, // two hours
                    minorTickInterval: 36e5, // one hour
                    tickLength: 0,
                    gridLineWidth: 1,
                    gridLineColor: 'rgba(128, 128, 128, 0.1)',
                    minorGridLineColor: 'rgba(128, 128, 128, 0.1)',
                    startOnTick: false,
                    endOnTick: false,
                    minPadding: 0,
                    maxPadding: 0,
                    offset: 30,
                    showLastLabel: true,
                    labels: {
                        format: '{value:%H}',
                        style: {
                            color: textColor
                        }
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
                        y: -15
                    },
                    opposite: true,
                    tickLength: 20,
                    gridLineWidth: 1,
                    gridLineColor: 'rgb(112, 112, 115)'
                }],

                yAxis: [{ // temperature axis
                    title: {
                        text: null
                    },
                    labels: {
                        format: '{value}°',
                        style: {
                            fontSize: '10px',
                            color: textColor,
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
                            stroke: Highcharts.getOptions().colors[2] + "!important"
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
                    data: vm.temperatures,
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
                    data: vm.precipitationsError,
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
                        enabled: vm.hasPrecipitationError,
                        formatter: function () {
                            if (this.point.maxvalue > 0) {
                                return this.point.maxvalue;
                            }
                        },
                        style: {
                            fontSize: '8px',
                            color: "contrast",
                            textOutline: "1px contrast"
                        }
                    }
                }, {
                    name: 'Precipitation',
                    data: vm.precipitations,
                    type: 'column',
                    color: '#68CFE8',
                    yAxis: 1,
                    groupPadding: 0,
                    pointPadding: 0,
                    grouping: false,
                    dataLabels: {
                        enabled: !vm.hasPrecipitationError,
                        formatter: function () {
                            if (this.y > 0) {
                                return this.y;
                            }
                        },
                        className: "precipitation-datalabels",
                        style: {
                            fontSize: '8px',
                            textOutline: "1px contrast"
                        }
                    },
                    tooltip: {
                        valueSuffix: ' mm'
                    }
                }, {
                    name: 'Air pressure',
                    color: Highcharts.getOptions().colors[2],
                    data: vm.pressures,
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
                    color: "#90ee7e",
                    lineWidth: 1.5,
                    data: vm.winds,
                    vectorLength: 18,
                    yOffset: -15,
                    tooltip: {
                        valueSuffix: ' km/h'
                    }
                }]
            }
        }
    },
    watch: {
        data() {
            this.parseData(this.data)
        }
    },
    methods: {
        /**
         * Rerenders SVGs on chart resize
         */
        rerender(chart) {
            this.drawBlocksForWindArrows(chart)
            this.drawWeatherSymbols(chart)
        },
        /**
         * Function to smooth the temperature line. The original data provides only whole degrees,
         * which makes the line graph look jagged. So we apply a running mean on it, but preserve
         * the unaltered value in the tooltip.
         */
        smoothLine(data) {  
            let i = data.length,
                sum,
                value

            while (i--) {
                data[i].value = value = data[i].y // preserve value for tooltip

                // Set the smoothed value to the average of the closest points, but don't allow
                // it to differ more than 0.5 degrees from the given value
                sum = (data[i - 1] || data[i]).y + value + (data[i + 1] || data[i]).y
                data[i].y = Math.max(value - 0.5, Math.min(sum / 3, value + 0.5))
            }
        },
        /**
         * Function to convert a compass direction to a number of degrees
         */
        windDirToDeg(dir) {
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
        },
        /**
         * Draw blocks around wind arrows, below the plot area
         */
        drawBlocksForWindArrows(chart) {
            let xAxis = chart.xAxis[0],
                x,
                pos,
                max,
                isLong,
                isLast,
                i;
            const vm = this
            
            this.destroyElements(vm.windsBlocksRendered)
            vm.windsBlocksRendered = []

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
                let block = chart.renderer.path(['M', x, chart.plotTop + chart.plotHeight + (isLong ? 0 : 28),
                    'L', x, chart.plotTop + chart.plotHeight + 32, 'Z'])
                    .attr({
                        stroke: chart.options.chart.plotBorderColor,
                        'stroke-width': 1
                    })
                vm.windsBlocksRendered.push(block)
                block.add();
            }
        },
        /**
         * Handle the data. This part of the code is not Highcharts specific, but deals with yr.no's
         * specific data format
         */ 
        parseData(states) {
            let vm = this,
                windDirections = [],
                temperatures = [],
                symbolDescs= []

            const moment = require("moment")

            each(states, function(value, key) {
                // sometimes iobroker returns an undefined state
                if (value === null || key === null) {
                    return
                }
                let splitted = key.split(".")
                // timestamp in milliseconds
                let ts = moment().startOf("day").add(parseInt(splitted[splitted.length - 2].split("_")[1]), 'hour').unix() * 1000
                switch (splitted[splitted.length - 1]) {
                    case "temp_value":
                        temperatures.push({
                            x: ts,
                            y: parseFloat(value.val),
                            to: ts + 3600000, // +1 Hour
                        })
                        break
                    case "symbol_desc":
                        symbolDescs.push(value.val)
                        break
                    case "pressure_value":
                        vm.pressures.push({
                            x: ts,
                            y: parseFloat(value.val),
                        })
                        break
                    case "rain_value":
                        vm.precipitations.push({
                            x: ts,
                            y: parseFloat(value.val),
                        })
                        break
                    case "iconURL":
                        vm.symbols.push(value.val)
                        break
                    case "wind_value":
                        vm.winds.push({
                            x: ts,
                            value: parseFloat(value.val),
                            direction: "N/A"
                        })
                        break  
                    case "wind_dir":
                        windDirections.push(vm.windDirToDeg(value.val))
                        break
                    default:
                        // do nothing
                }

            })
            each(vm.winds, function(val, idx) {
                val.direction = windDirections[idx]
            })
            each(temperatures, function(val, idx) {
                val.symbolDesc = symbolDescs[idx]
            })
            // Smooth the line
            vm.smoothLine(temperatures)

            vm.temperatures = temperatures
        },
        /**
         * Post-process the chart from the callback function, the second argument to Highcharts.Chart.
         */
        onChartLoad(chart) {

            this.$watch("temperatures", function() {
                this.drawWeatherSymbols(chart)
            })

            this.$watch("winds", function() {
                this.drawBlocksForWindArrows(chart)
            })
        },
        /** 
         * Destroys all rendered elements
         */
        destroyElements(elements) {
            each(elements, function(el) {
                el.destroy()
            })
        },
        /**
         * Draw the weather symbols on top of the temperature series. The symbols are
         * fetched from iobroker 'daswetter' adapter.
         */
        drawWeatherSymbols(chart) {
            const vm = this;

            vm.destroyElements(vm.iconsRendered)
            vm.iconsRendered = []

            each(chart.series[0].data, function (point, i) {
                if (vm.resolution > 36e5 || i % 2 === 0) {
                    
                    let icon = chart.renderer
                        .image(
                            'https://192.168.178.36:8449' + vm.symbols[i],
                            point.plotX + chart.plotLeft - 8,
                            point.plotY + chart.plotTop - 30,
                            30,
                            30
                        )
                        .attr({
                            zIndex: 5
                        })
                    // Store reference to the icon...
                    vm.iconsRendered.push(icon)
                    // ...and add it to the dom
                    icon.add() 
                }
            })
        }
    }
}
</script>

<style lang="scss">
.precipitation-datalabels {
    font-size: 8px;
    @include themify($themes) {
        stroke: themed('chartAxisLabelColor');
    }
}
</style>
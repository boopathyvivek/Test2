import { Component, OnInit, ViewChild, Input } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexLegend
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  legend: ApexLegend;
  colors: string[];
};

@Component({
  selector: 'app-bar-marker-chart',
  templateUrl: './bar-marker-chart.component.html',
  styleUrls: ['./bar-marker-chart.component.css']
})
export class BarMarkerChartComponent implements OnInit {
  @ViewChild("chart", { static: false }) chart: ChartComponent;
  public chartOptions: Partial<ChartOptions> | any;
  showChart = false;
  isnodata = false;
  constructor() { }
  @Input() data: any;
  @Input() chartData: any;

  ngOnInit() {
  }

  public LoadChartData(chartData) {
    //console.log("Test 1: "+chartData);
    this.chartOptions = {
      //series: [
      //  {
      //    name: "Actual",
      //    data: [
      //      {
      //        x: "January",
      //        y: 1292,
      //        goals: [
      //          {
      //            name: "Expected",
      //            value: 1400,
      //            strokeWidth: 5,
      //            strokeColor: "#775DD0"
      //          }
      //        ]
      //      },
      //      {
      //        x: "Febrauary",
      //        y: 4432,
      //        goals: [
      //          {
      //            name: "Expected",
      //            value: 5400,
      //            strokeWidth: 5,
      //            strokeColor: "#775DD0"
      //          }
      //        ]
      //      },
      //      {
      //        x: "March",
      //        y: 5423,
      //        goals: [
      //          {
      //            name: "Expected",
      //            value: 5200,
      //            strokeWidth: 5,
      //            strokeColor: "#775DD0"
      //          }
      //        ]
      //      },
      //      {
      //        x: "April",
      //        y: 6653,
      //        goals: [
      //          {
      //            name: "Expected",
      //            value: 6500,
      //            strokeWidth: 5,
      //            strokeColor: "#775DD0"
      //          }
      //        ]
      //      },
      //      {
      //        x: "May",
      //        y: 8133,
      //        goals: [
      //          {
      //            name: "Expected",
      //            value: 6600,
      //            strokeWidth: 5,
      //            strokeColor: "#775DD0"
      //          }
      //        ]
      //      },
      //      {
      //        x: "June",
      //        y: 7132,
      //        goals: [
      //          {
      //            name: "Expected",
      //            value: 7500,
      //            strokeWidth: 5,
      //            strokeColor: "#775DD0"
      //          }
      //        ]
      //      },
      //      {
      //        x: "July",
      //        y: 7332,
      //        goals: [
      //          {
      //            name: "Expected",
      //            value: 8700,
      //            strokeWidth: 5,
      //            strokeColor: "#775DD0"
      //          }
      //        ]
      //      },
      //      {
      //        x: "August",
      //        y: 6553,
      //        goals: [
      //          {
      //            name: "Expected",
      //            value: 7300,
      //            strokeWidth: 5,
      //            strokeColor: "#775DD0"
      //          }
      //        ]
      //      },
      //      {
      //        x: "September",
      //        y: 8133,
      //        goals: [
      //          {
      //            name: "Expected",
      //            value: 6600,
      //            strokeWidth: 5,
      //            strokeColor: "#775DD0"
      //          }
      //        ]
      //      },
      //      {
      //        x: "October",
      //        y: 7132,
      //        goals: [
      //          {
      //            name: "Expected",
      //            value: 7500,
      //            strokeWidth: 5,
      //            strokeColor: "#775DD0"
      //          }
      //        ]
      //      },
      //      {
      //        x: "November",
      //        y: 7332,
      //        goals: [
      //          {
      //            name: "Expected",
      //            value: 8700,
      //            strokeWidth: 5,
      //            strokeColor: "#775DD0"
      //          }
      //        ]
      //      },
      //      {
      //        x: "December",
      //        y: 6553,
      //        goals: [
      //          {
      //            name: "Expected",
      //            value: 7300,
      //            strokeWidth: 5,
      //            strokeColor: "#775DD0"
      //          }
      //        ]
      //      }
      //    ]
      //  }
      //],
      series: chartData,
      chart: {
        height: 350,
        type: "bar"
      },
      plotOptions: {
        bar: {
          horizontal: true
        }
      },
      colors: ["#00E396"],
      title: {
        text: "Closed Orders"
      },
      dataLabels: {
        formatter: function (val, opts) {
          const goals =
            opts.w.config.series[opts.seriesIndex].data[opts.dataPointIndex]
              .goals;

          if (goals && goals.length) {
            return `${val} / ${goals[0].value}`;
          }
          return val;
        }
      },
      legend: {
        show: true,
        showForSingleSeries: true,
        customLegendItems: ["Actual", "Expected"],
        markers: {
          fillColors: ["#00E396", "#775DD0"]
        }
      }
    };
  }

  ngOnChanges(changes: any) {

    if (changes.chartData && changes.chartData.currentValue) {
      console.log(changes.chartData);
      this.LoadChartData(changes.chartData.currentValue);

      this.showChart = true;
      if (changes.chartData.currentValue.length == 0)
        this.isnodata = true;
      else
        this.isnodata = false;
    }
    // You can also use categoryId.previousValue and 
    // categoryId.firstChange for comparing old and new values

  }
}

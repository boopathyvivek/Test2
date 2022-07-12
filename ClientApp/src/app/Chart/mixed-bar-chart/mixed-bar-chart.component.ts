import { Component, OnInit, ViewChild, Input } from "@angular/core";

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexFill,
  ApexYAxis,
  ApexTooltip,
  ApexTitleSubtitle,
  ApexXAxis
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis | ApexYAxis[];
  title: ApexTitleSubtitle;
  labels: string[];
  stroke: any; // ApexStroke;
  dataLabels: any; // ApexDataLabels;
  fill: ApexFill;
  tooltip: ApexTooltip;
};

@Component({
  selector: 'app-mixed-bar-chart',
  templateUrl: './mixed-bar-chart.component.html',
  styleUrls: ['./mixed-bar-chart.component.css']
})
export class MixedBarChartComponent implements OnInit {

  @ViewChild("chart", { static: false }) chart: ChartComponent;
  public chartOptions: Partial<ChartOptions> | any;
  showChart = false;


  constructor() {
    
  }
  @Input() data: any;
  @Input() chartData: any;


  ngOnInit() {
  }

  LoadChartData(chartData) {
    console.log(chartData);
    this.chartOptions = {
      //series: [
      //  {
      //    name: "Orders Delivered",
      //    type: "column",
      //    data: [440, 505, 414, 671, 227, 413, 201, 352, 752, 320, 257, 160]
      //  },
      //  {
      //    name: "Billed Amount",
      //    type: "line",
      //    data: [23, 42, 35, 27, 43, 22, 17, 31, 22, 22, 12, 16]
      //  }
      //],
      series: chartData.velocitydata,
      chart: {
        height: 350,
        type: "line"
      },
      stroke: {
        width: [0, 4]
      },
      title: {
        text: "Velocity"
      },
      dataLabels: {
        enabled: true,
        enabledOnSeries: [1]
      },
      //labels: [
      //  "January",
      //  "February",
      //  "March",
      //  "April",
      //  "May",
      //  "June",
      //  "July",
      //  "August",
      //  "September",
      //  "October",
      //  "November",
      //  "December"
      //],
      labels: chartData.label,
      xaxis: {
        type: "Category"
      },
      yaxis: [
        {
          title: {
            text: "Orders Delivered"
          }
        },
        {
          opposite: true,
          title: {
            text: "Billed Amount"
          }
        }
      ]
    };
  }

  ngOnChanges(changes: any) {

    if (changes.chartData && changes.chartData.currentValue) {
      console.log(changes.chartData);
      this.LoadChartData(changes.chartData.currentValue);

      this.showChart = true;
    }
    // You can also use categoryId.previousValue and 
    // categoryId.firstChange for comparing old and new values

  }
}

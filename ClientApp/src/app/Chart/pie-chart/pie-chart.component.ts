import { Component, OnInit, ViewChild, Input } from '@angular/core';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexTitleSubtitle,
  ApexNonAxisChartSeries,
  ApexResponsive
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
};

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent implements OnInit {
  @ViewChild("chart", { static: false }) chart: ChartComponent;
  public chartOptions: Partial<ChartOptions> | any;
  constructor() { }
  @Input() type: any;
  @Input() title: any;
  @Input() chartData: any;

  showChart = false;
  isnodata = false;
  ngOnInit() {
  }
  public LoadChartData(chartData) {
    if (this.chartData) {
      let label = chartData.label;
      let data = chartData.data;

      this.chartOptions = {
        series: data,
        chart: {
          width: 330,
          type: this.type
        },
        labels: label,
        title: {
          text: this.title
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200
              },
              legend: {
                position: "bottom"
              }
            }
          }
        ]
      };
    }
  }

  ngOnChanges(changes: any) {

    if (changes.chartData && changes.chartData.currentValue) {
      console.log(changes.chartData);
      this.LoadChartData(changes.chartData.currentValue);

      this.showChart = true;
      if (changes.chartData.currentValue.label && changes.chartData.currentValue.label.length == 0)
        this.isnodata = true;
      else
        this.isnodata = false;
    }
    // You can also use categoryId.previousValue and 
    // categoryId.firstChange for comparing old and new values

  }
}

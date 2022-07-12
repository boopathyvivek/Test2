import { Component, OnInit, ViewChild } from '@angular/core';
import { ServiceService } from '../Services/service.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UserData, Orders, Company, ReportitemLevel1, ReportitemLevel2 } from '../order.model';
import { FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { FormGroup, FormControl } from '@angular/forms';


@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {

  public selected = "All";
  selectedYear = '2021';

  //Chart Data - Delivery
  actual = "Actual"
  expected = "Expected"
  strokeWidth = 5;
  strokeColor = "#775DD0";

  //Chart Data - Velocity
  velocitylname = "Orders Delivered";
  velocityltype = "column";
  velocityrname = "Billed Amount";
  velocityrtype = "line";


  rdbtnReport = "Company";
  clickedRow: any = [];
  DataLoaded = false;
  orderList: any[] = [];
  chartType: any='pie';
  barchart: any = 'bar';

  barChartTitle = "Date wise Orders";
  companyChartTitle = "Company-wise Business";
  productChartTitle = "Product-wise Business";


  displayedColumns: string[] = ['ItemId', 'ItemName', 'ItemValue'];
  displayedColumnsProduct: string[] = ['ItemId', 'ItemName', 'ItemValue'];

  dataSourceCompany: MatTableDataSource<UserData>;
  dataSourceProduct: MatTableDataSource<UserData>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;


  optionsCompany: any[];// = ['One', 'Two', 'Three'];
  optionsCompany_Outsourced: any[];// = ['One', 'Two', 'Three'];
  optionsProduct: any[];// = ['Four', 'Five', 'Six'];
  companyControl = new FormControl('');
  productControl = new FormControl('');
  companyControl_Outsourced = new FormControl('');

  YearControl = new FormControl();
  

  OrdersReceived = 0;
  OrdersCompleted = 0;
  OrdersPending = 0;
  Total = 0;

  ReportCompanyData;
  ReportProductData;
  ReportDeliveryData;
  ReportVelocityData;

  deliveryData;
  velocityData;

  companyChartData;
  productChartData;
  deliveryChartData = [];
  velocityChartData;

  constructor(private serviceService: ServiceService) {

  }

  ngOnInit() {
    this.GetAllMasterData();
    this.GetAllReportData();
    //this.YearControl.value = "2021";

  }

  public SelectedRow(row) {
    this.clickedRow = row;
    console.log(this.clickedRow);

  }

  GetAllReportData(): void {
    let company = 0;
    let product = 0;
    let year = 0;

    this.deliveryChartData = [];

    if (this.companyControl.value && this.companyControl.value != "" && this.companyControl.value != "All")
      company = this.companyControl.value.CompanyID;

    if (this.productControl.value && this.productControl.value != "" && this.productControl.value != "All")
      product = this.productControl.value.ProductID;

    if (this.YearControl.value && this.YearControl.value != "" && this.YearControl.value != "All")
      year = this.YearControl.value;

    this.serviceService.GetReportData(company, product, year).subscribe(result => {
      this.DataLoaded = true;
      
      if (result.status == 200) {
        //this.orderList = result.body;
        console.log(result);
        if (result.body) {
          if (result.body.ReportHeaderData) {
            this.OrdersReceived = result.body.ReportHeaderData.OrdersReceived;
            this.OrdersCompleted = result.body.ReportHeaderData.OrdersCompleted;
            this.OrdersPending = result.body.ReportHeaderData.OrdersPending;
            this.Total = result.body.ReportHeaderData.Total;
          }
          if (result.body.ReportCompanyData) 
            this.ArrangeCompany(result.body.ReportCompanyData);

          if (result.body.ReportProductData)
            this.ArrangeProduct(result.body.ReportProductData);

          if (result.body.ReportDeliveryData)
            this.ArrangeDelivery(result.body.ReportDeliveryData);

          if (result.body.ReportVelocityData)
            this.ArrangeVelocity(result.body.ReportVelocityData);

        }
        else {
          alert("Some error occured while retrieving Report data. Please contact admin.");
        }
      }
      else {
        alert("Some error occured while retrieving Report data. Please contact admin for more info");
      }

    }), error => console.error(error);
  }

  public DropdownChanged(test) {
    this.GetAllReportData();
  }

  public GetAllMasterData() {
    this.serviceService.GetAllMasterData().subscribe(result => {
      if (result.status == 200) {
        this.orderList = result.body;
        console.log(result);
        if (result.body) {
          this.serviceService.SetMasterData(result.body);

          if (result.body.Company && result.body.Company.length > 0) {
            let company = result.body.Company;
            this.optionsCompany = company.filter(x => x.IsOutsourceCompany != true);
            this.optionsCompany_Outsourced = company.filter(x => x.IsOutsourceCompany == true);
          }

          if (result.body.Product && result.body.Product.length > 0) {
            this.optionsProduct = result.body.Product;
          }
        }
        else {
          alert("Some error occured while retrieving Orders. Please contact admin.");
        }
      }
      else {
        alert("Some error occured while retrieving Orders.. Please contact admin for more info");
      }

    }), error => console.error(error);

  }

  private ArrangeCompany(orderList) {
    this.orderList = orderList;

    this.dataSourceCompany = new MatTableDataSource(this.orderList);
    this.dataSourceCompany.paginator = this.paginator;
    this.dataSourceCompany.sort = this.sort;

    let data: any[] = [];
    let label: any[] = [];

    orderList.forEach(values => {
      data.push(values.ItemValue);
      if (values.ItemName.length < 12)
        label.push(values.ItemName);
      else
        label.push(values.ItemName.slice(0, 10) + "..");
      });
    this.companyChartData = { label: label, data: data };
  }

  private ArrangeProduct(orderList) {
    this.orderList = orderList;

    this.dataSourceProduct = new MatTableDataSource(this.orderList);
    this.dataSourceProduct.paginator = this.paginator;
    this.dataSourceProduct.sort = this.sort;

    let data: any[] = [];
    let label: any[] = [];

    orderList.forEach(values => {
      data.push(values.ItemValue);
      label.push(values.ItemName);
    });
    this.productChartData = { label: label, data: data };
  }

  private ArrangeDelivery(deliverydata) {
    
    let object: any = {};
    let innerobject: any = {};

    let individualdata: any[] = [];

    deliverydata.forEach(values => {
      object = {};
      object.goals = [];
      innerobject = {};

      object.x = values.ItemName;
      object.y = values.ItemValue;
      
      innerobject.name = this.expected;
      innerobject.value = values.ItemValue2;
      innerobject.strokeWidth = this.strokeWidth;
      innerobject.strokeColor = this.strokeColor;

      object.goals.push(innerobject);

      individualdata.push(object);

    });
    let data = { name: this.actual, data: individualdata };
    this.deliveryChartData.push(data);
    console.log("Test from Report: "+this.deliveryChartData);
  }

  private ArrangeVelocity(velocitydata) {
    let ldata: any[] = [];
    let rdata: any[] = [];

    let label: any[] = [];

    velocitydata.forEach(values => {
      label.push(values.ItemName);
      ldata.push(values.ItemValue);
      rdata.push(values.ItemValue2);
    });

    let lsideobject: any = {};
    let rsideobject: any = {};

    lsideobject.data = [];
    rsideobject.data = [];

    lsideobject.name = this.velocitylname;
    lsideobject.type = this.velocityltype;
    lsideobject.data = ldata;

    rsideobject.name = this.velocityrname;
    rsideobject.type = this.velocityrtype;
    rsideobject.data = rdata;

    let velocitydataFinal = [];
    velocitydataFinal.push(lsideobject);
    velocitydataFinal.push(rsideobject);

    this.velocityChartData = { velocitydata: velocitydataFinal, label: label}

  }

}

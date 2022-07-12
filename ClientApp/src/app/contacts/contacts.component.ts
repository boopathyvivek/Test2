import { Component, OnInit } from '@angular/core';
import { AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

import { SelectionModel } from '@angular/cdk/collections';
import { ServiceService } from '../Services/service.service';

import { TemplateRef } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material';

import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { UserData, Orders, Company } from '../order.model';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

import { MatDatepickerModule } from '@angular/material';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements AfterViewInit, OnInit, ErrorStateMatcher {

  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }

  displayedColumns: string[] = ['Name', 'Email', 'Message', 'CreatedDate'];
  dataSource: MatTableDataSource<UserData>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  //@ViewChild(MatAutocompleteModule, { static: true }) autocomplete: MatAutocompleteModule;


  //clickedRows = new Set<PeriodicElement>();
  clickedRow: any = [];
  orderList: any[] = [];
  userDetails;

  Company;

  isAddDisabled = true;
  isEditDisabled = true;
  isDeleteDisabled = true;
  selected = 'None';
  selectedproduct;

  @ViewChild('editCompanyModal', { static: true }) editCompanyModal: TemplateRef<any>;
  private editCompanyDialogRef: MatDialogRef<TemplateRef<any>>;

  companyControl = new FormControl('', Validators.required);
  pocControl = new FormControl('', Validators.required);

  mobileControl = new FormControl('', Validators.required);
  mobile2Control = new FormControl('');


  AddressControl = new FormControl('');
  companyControl_Outsourced = new FormControl('');



  //myControl = new FormControl();
  //myControlCompany = new FormControl();
  //myControlCompany_Outsourced = new FormControl();

  ReceivedDateControl = new FormControl();
  DeliveryDateControl = new FormControl();
  ActualDeliveryDateControl = new FormControl();


  CostperpieceControl = new FormControl();
  discountControl = new FormControl();
  //options: string[] = ['One', 'Two', 'Three'];

  optionsCompany: any[];// = ['One', 'Two', 'Three'];
  optionsProduct: any[];// = ['Four', 'Five', 'Six'];

  filteredOptionsCompany: Observable<string[]>;
  filteredOptionsCompany_Outsourced: Observable<string[]>;

  filteredOptionsProduct: Observable<string[]>;

  AddUpdateButton = "Add";
  ReceivedDate;
  DeliveryDate;
  ActualDeliveryDate;
  GST = true;
  IsOrderOutsourced = false;
  IsDiscount = false;

  Costperpiece = "";
  Totalbeforetax = 0;
  //GSTcharges = 0;
  TotalCharge = 0;
  Quantity_Outsourced = 0;
  bill_Outsourced = 0;
  company: Company = {};


  GSTfromDB = 0;
  GSTUsed = 0;

  emailFormControl = new FormControl('', [

    Validators.email
  ]);
  numberFormControl = new FormControl('', [
    Validators.required,
    //Validators.,
  ]);

  Quantity_OutsourcedControl = new FormControl('', [
    //Validators.required,
    //Validators.,
  ]);

  bill_OutsourcedControl = new FormControl('', [
    //Validators.required,
    //Validators.,
  ]);
  Quantity = "";
  discount;
  matcher = new ErrorStateMatcher();
  DataLoaded = false;

  constructor(private datePipe: DatePipe, private router: Router, private serviceService: ServiceService, public dialog: MatDialog) {
    this.userDetails = this.serviceService.GetLoginUserDetails();
    if (!this.userDetails || !this.userDetails.UserName)
      this.router.navigate(['login']);

  }

  ngAfterViewInit() {
    //this.dataSource.paginator = this.paginator;
    //this.dataSource.sort = this.sort;
  }

  ngOnInit() {
    this.GetAllOrders();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  public Home() {
    this.router.navigate(['home']);
  }

  public SelectedRow(row) {
    this.clickedRow = row;
    console.log(this.clickedRow);

  }


  GetAllOrders(): void {
    //this.orderList = [];
    this.serviceService.GetAllContacts().subscribe(result => {
      this.DataLoaded = true;

      if (result.status == 200) {
        //this.orderList = result.body;
        console.log(result);
        if (result.body) {
          this.ArrangeOrders(result.body);
        }
        else {
          alert("Some error occured while retrieving Contacts. Please contact admin.");
        }
      }
      else {
        alert("Some error occured while retrieving Contacts. Please contact admin for more info");
      }

    }), error => console.error(error);


  }

  public CorrectDates(orderList) {
    if (orderList && orderList.length > 0) {
      orderList.forEach(function (value) {
        //if (value.ActualDeliveryDate == "0001-01-01T00:00:00")
        //  value.ActualDeliveryDate = "";
        if (value.CreatedDate == "0001-01-01T00:00:00")
          value.CreatedDate = "";

      });
    }
    this.orderList = orderList;
  }

  private ArrangeOrders(orderList) {
    this.orderList = orderList;

    this.CorrectDates(this.orderList);

    this.dataSource = new MatTableDataSource(this.orderList);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    //this.GetAllMasterData();
  }

}


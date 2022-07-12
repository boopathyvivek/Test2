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
import { DialogBoxComponent } from '../dialog-box/dialog-box.component';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements AfterViewInit, OnInit, ErrorStateMatcher  {

  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }

  displayedColumns: string[] = ['CompanyName', 'IsOutsourceCompany', 'POC', 'Mobile1', 'Mobile2', 'Email', 'Address', 'CreatedBy', 'CreatedDate', 'ModifiedBy', 'ModifiedDate'];
  dataSource: MatTableDataSource<UserData>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  //@ViewChild(MatAutocompleteModule, { static: true }) autocomplete: MatAutocompleteModule;


  orderUpdateConfirmationHead = "Update Company - Confirmation";
  orderUpdateConfirmationBody = "Are you sure you want to update this Company details?";

  orderDeleteConfirmationHead = "Delete Company - Confirmation";
  orderDeleteConfirmationBody = "Are you sure you want to delete this Company?";

  //clickedRows = new Set<PeriodicElement>();
  clickedRow: any = [];
  orderList: any[] = [];
  userDetails;

  Company;
  IsOutsourceCompany = false;
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
    this.ValidateButtons();
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
    this.ValidateButtons();

  }


  GetAllOrders(): void {
    //this.orderList = [];
    this.serviceService.GetAllCompany().subscribe(result => {
      this.DataLoaded = true;

      if (result.status == 200) {
        //this.orderList = result.body;
        console.log(result);
        if (result.body) {
          this.ArrangeOrders(result.body);
        }
        else {
          alert("Some error occured while retrieving Company. Please contact admin.");
        }
      }
      else {
        alert("Some error occured while retrieving Company. Please contact admin for more info");
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
        if (value.ModifiedDate == "0001-01-01T00:00:00")
          value.ModifiedDate = "";
      });
    }
    this.orderList = orderList;
  }

  public ValidateButtons() {
    this.userDetails = this.serviceService.GetLoginUserDetails();

    if (this.userDetails) {
      if (this.userDetails.AccessLevel > 1)
        this.isAddDisabled = false;
      if ((this.userDetails.AccessLevel > 2) && (this.clickedRow && this.clickedRow.CompanyName))
        this.isEditDisabled = false;
      if ((this.userDetails.AccessLevel > 3) && (this.clickedRow && this.clickedRow.CompanyName))
        this.isDeleteDisabled = false;
    }
  }

  openCompanyDetailsDialog(from): void {

    if (from) {
      this.AddUpdateButton = "Update";
      this.GetPopupselectedValues();
    }
    else {
      this.AddUpdateButton = "Add";
      this.ClearPopupdata();
    }

    const dialogConfig = new MatDialogConfig();
    dialogConfig.restoreFocus = false;
    dialogConfig.autoFocus = false;
    dialogConfig.role = 'dialog';
    dialogConfig.width = "1000px";

    this.editCompanyDialogRef = this.dialog.open(this.editCompanyModal, dialogConfig);

    this.editCompanyDialogRef.afterClosed().subscribe(result => {
      //consoleOut('The dialog was closed...');
    });
  }

  closeCompanyDetailsDialog() {
    this.editCompanyDialogRef.close();
  }

  //private _filterCompany(value: string): string[] {
  //  const filterValue = value.toLowerCase();

  //  return this.optionsCompany.filter(option => option.CompanyName.toLowerCase().includes(filterValue));
  //}

  //private _filterProduct(value: string): string[] {
  //  const filterValue = value.toLowerCase();

  //  return this.optionsProduct.filter(option => option.ProductName.toLowerCase().includes(filterValue));
  //}

  public SetGST(selecteditem) {
    this.GST = selecteditem;
    console.log(selecteditem);

    this.CalculateGSTPercent();

    //if (this.GST && this.numberFormControl.value && this.CostperpieceControl.value) {
    //  //this.CalculateGSTCharges();
    //}
    //else
    //  this.GSTcharges = 0;

  }

  public CalculateGSTPercent() {
    if (this.GST) {
      if (this.AddUpdateButton == "Update")
        this.GSTUsed = this.clickedRow.GSTPercent > 0 ? this.clickedRow.GSTPercent : this.GSTfromDB;
      else
        this.GSTUsed = this.GSTfromDB;
    }
    else
      this.GSTUsed = 0;

    return this.GSTUsed;
  }

  public SetOrderSourced(selecteditem) {
    this.IsOrderOutsourced = selecteditem;
    console.log(this.IsOrderOutsourced);

    if (!this.IsOrderOutsourced) {
      this.companyControl_Outsourced.setValue("");
      this.bill_Outsourced = 0;

      this.Quantity_OutsourcedControl.setValue("");
      this.bill_OutsourcedControl.setValue("");
    }

  }


  public ClearPopupdata() {
    this.companyControl.reset();
    this.pocControl.reset();
    this.mobileControl.reset();
    this.mobile2Control.reset();
    this.emailFormControl.reset();
    this.AddressControl.reset();

    this.IsOutsourceCompany = false;


  }

  public GetPopupselectedValues() {
    this.ClearPopupdata();
    if (this.clickedRow) {
      this.companyControl.setValue(this.clickedRow.CompanyName);
      this.pocControl.setValue(this.clickedRow.POC);
      this.mobileControl.setValue(this.clickedRow.Mobile1);

      this.mobile2Control.setValue(this.clickedRow.Mobile2);
      this.emailFormControl.setValue(this.clickedRow.Email);
      this.AddressControl.setValue(this.clickedRow.Address);

      this.IsOutsourceCompany = this.clickedRow.IsOutsourceCompany;


    }
  }

  public SaveOrder() {
    let user = this.userDetails;
    this.company.UserID = user.UserID;

    this.company.CompanyName = this.companyControl.value;
    this.company.POC = this.pocControl.value;
    this.company.Mobile1 = this.mobileControl.value;

    this.company.Mobile2 = this.mobile2Control.value;
    this.company.Email = this.emailFormControl.value;
    this.company.Address = this.AddressControl.value;

    this.company.IsOutsourceCompany = this.IsOutsourceCompany;

    if (this.AddUpdateButton == "Update") {
      this.company.CompanyID = this.clickedRow.CompanyID;
    }
    else {
      this.company.CompanyID = 0;
    }

    console.log(this.company);
    this.serviceService.SaveCompany(this.company).subscribe(result => {
      if (result.status == 200) {
        console.log(result);
        this.dialog.closeAll();
        this.isEditDisabled = true;
        this.isDeleteDisabled = true;

        if (result.body) {
          this.serviceService.openSnackBarGreen("Company details saved Successfully!!");
          this.ArrangeOrders(result.body);
        }
        else
          this.serviceService.openSnackBarRed("Some error occured while saving Company. Please contact admin.");

      }
      else {
        this.serviceService.openSnackBarRed("Some error occured while saving Company. Please contact admin for more info.");
      }
    }), error => console.error(error);


  }

  private ArrangeOrders(orderList) {
    this.orderList = orderList;

    this.CorrectDates(this.orderList);

    this.dataSource = new MatTableDataSource(this.orderList);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    //this.GetAllMasterData();
  }

  public DeleteOrder() {
    let user = this.userDetails;
    let UserID = user.UserID;

    let CompanyID = this.clickedRow.CompanyID;

    this.serviceService.DeleteCompany(CompanyID, UserID).subscribe(result => {
      if (result.status == 200) {
        console.log(result);

        if (result.body) {
          this.serviceService.openSnackBarGreen("Company deleted Successfully!!");
          this.ArrangeOrders(result.body);
        }
        else
          this.serviceService.openSnackBarRed("Some error occured while saving Company. Please contact admin.");

      }
      else {
        this.serviceService.openSnackBarRed("Some error occured while saving Company. Please contact admin for more info.");
      }
    }), error => console.error(error);
  }

  public SetOutsourceCompany(selecteditem) {
    this.IsOutsourceCompany = selecteditem;
    console.log(this.IsOutsourceCompany);
  }

  public SaveOrderConfirmation() {
    if (this.AddUpdateButton == "Update") {

    let head = this.orderUpdateConfirmationHead;
    let body = this.orderUpdateConfirmationBody;

    const dialogRef = this.dialog.open(DialogBoxComponent, {
      //width: '250px',
      data: { head: head, body: body, from: 'Others' }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result) {
        this.SaveOrder();
      }
    });
    }
    else {
      this.SaveOrder();
    }
  }

  public DeleteOrderConfirmation() {
    let head = this.orderDeleteConfirmationHead;
    let body = this.orderDeleteConfirmationBody;

    const dialogRef = this.dialog.open(DialogBoxComponent, {
      //width: '250px',
      data: { head: head, body: body, from: 'Others' }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result) {
        this.DeleteOrder();
      }
    });
  }


}

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
import { UserData, Product } from '../order.model';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

import { MatDatepickerModule } from '@angular/material';
import { DatePipe } from '@angular/common';

import { DialogBoxComponent } from '../dialog-box/dialog-box.component';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements AfterViewInit, OnInit, ErrorStateMatcher {


  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }

  displayedColumns: string[] = ['ProductName', 'CostperPiece', 'IsWeightedinKG', 'Description', 'CreatedBy', 'CreatedDate', 'ModifiedBy', 'ModifiedDate'];
  dataSource: MatTableDataSource<UserData>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  //@ViewChild(MatAutocompleteModule, { static: true }) autocomplete: MatAutocompleteModule;

  orderUpdateConfirmationHead = "Update Product - Confirmation";
  orderUpdateConfirmationBody = "Are you sure you want to update this Product details?";

  orderDeleteConfirmationHead = "Delete Product - Confirmation";
  orderDeleteConfirmationBody = "Are you sure you want to delete this Product?";

  //clickedRows = new Set<PeriodicElement>();
  clickedRow: any = [];
  orderList: any[] = [];
  userDetails;

  //Company;

  isAddDisabled = true;
  isEditDisabled = true;
  isDeleteDisabled = true;
  selected = 'None';
  selectedproduct;
  DataLoaded = false;

  @ViewChild('editCompanyModal', { static: true }) editCompanyModal: TemplateRef<any>;
  private editCompanyDialogRef: MatDialogRef<TemplateRef<any>>;

  productNameControl = new FormControl('', Validators.required);
  descriptionControl = new FormControl('');

  costControl = new FormControl('', Validators.required);

  IsWeightinKG = false;


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
  company: Product = {};


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
    this.serviceService.GetAllProduct().subscribe(result => {
      this.DataLoaded = true;

      if (result.status == 200) {
        //this.orderList = result.body;
        console.log(result);
        if (result.body) {
          this.ArrangeOrders(result.body);
        }
        else {
          alert("Some error occured while retrieving Product. Please contact admin.");
        }
      }
      else {
        alert("Some error occured while retrieving Product. Please contact admin for more info");
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
      if ((this.userDetails.AccessLevel > 2) && (this.clickedRow && this.clickedRow.ProductID))
        this.isEditDisabled = false;
      if ((this.userDetails.AccessLevel > 3) && (this.clickedRow && this.clickedRow.ProductID))
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

  //public SetOrderSourced(selecteditem) {
  //  this.IsOrderOutsourced = selecteditem;
  //  console.log(this.IsOrderOutsourced);

  //  if (!this.IsOrderOutsourced) {
  //    this.companyControl_Outsourced.setValue("");
  //    this.bill_Outsourced = 0;

  //    this.Quantity_OutsourcedControl.setValue("");
  //    this.bill_OutsourcedControl.setValue("");
  //  }

  //}


  public ClearPopupdata() {
    this.productNameControl.reset();
    this.descriptionControl.reset();
    this.costControl.reset();
    this.IsWeightinKG = false;
  }

  public GetPopupselectedValues() {
    this.ClearPopupdata();
    if (this.clickedRow) {
      this.productNameControl.setValue(this.clickedRow.ProductName);
      this.descriptionControl.setValue(this.clickedRow.Description);
      this.costControl.setValue(this.clickedRow.CostperPiece);

      this.IsWeightinKG = this.clickedRow.IsWeightedinKG;

    }
  }

  public SaveOrder() {
    let user = this.userDetails;
    this.company.UserID = user.UserID;

    this.company.ProductName = this.productNameControl.value;
    this.company.Description = this.descriptionControl.value;
    this.company.CostperPiece = this.costControl.value;

    this.company.IsWeightedinKG = this.IsWeightinKG;
   
    if (this.AddUpdateButton == "Update") {
      this.company.ProductID = this.clickedRow.ProductID;
    }
    else {
      this.company.ProductID = 0;
    }

    console.log(this.company);
    this.serviceService.SaveProduct(this.company).subscribe(result => {
      if (result.status == 200) {
        console.log(result);
        this.dialog.closeAll();
        this.isEditDisabled = true;
        this.isDeleteDisabled = true;

        if (result.body) {
          this.serviceService.openSnackBarGreen("Product details saved Successfully!!");
          this.ArrangeOrders(result.body);
        }
        else
          this.serviceService.openSnackBarRed("Some error occured while saving Product. Please contact admin.");

      }
      else {
        this.serviceService.openSnackBarRed("Some error occured while saving Product. Please contact admin for more info.");
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

    let ProductID = this.clickedRow.ProductID;

    this.serviceService.DeleteProduct(ProductID, UserID).subscribe(result => {
      if (result.status == 200) {
        console.log(result);

        if (result.body) {
          this.serviceService.openSnackBarGreen("Product deleted Successfully!!");
          this.ArrangeOrders(result.body);
        }
        else
          this.serviceService.openSnackBarRed("Some error occured while saving Orders. Please contact admin.");

      }
      else {
        this.serviceService.openSnackBarRed("Some error occured while saving Orders. Please contact admin for more info.");
      }
    }), error => console.error(error);
  }

  public SetDiscount(selecteditem) {
    this.IsWeightinKG = selecteditem;
    console.log(this.IsWeightinKG);
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


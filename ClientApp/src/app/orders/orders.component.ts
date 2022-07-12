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
import { UserData, Orders, Order, Company } from '../order.model';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

import { MatDatepickerModule } from '@angular/material';
import { DatePipe } from '@angular/common';
import { DialogBoxComponent } from '../dialog-box/dialog-box.component';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements AfterViewInit, OnInit, ErrorStateMatcher  {

  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }

  displayedColumns: string[] = ['ReceivedDate', 'CompanyName', 'ProductName', 'Quantity', 'ExpectedDeliveryDate', 'ActualDeliveryDate', 'CreatedBy', 'CreatedDate', 'ModifiedBy', 'ModifiedDate'];
  dataSource: MatTableDataSource<UserData>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  //@ViewChild(MatAutocompleteModule, { static: true }) autocomplete: MatAutocompleteModule;


  orderUpdateConfirmationHead = "Update Order - Confirmation";
  orderUpdateConfirmationBody = "Are you sure you want to update this Order details?";

  orderDeleteConfirmationHead = "Delete Order - Confirmation";
  orderDeleteConfirmationBody = "Are you sure you want to delete this Order?";

  orderStatus = "Not Defined";
  isOrderDelivered = false;

  clickedRow:any =[];
  orderList:any[] = [];
  userDetails;

  Company;
  DataLoaded = false;
  isAddDisabled = true;
  isEditDisabled = true;
  isDeleteDisabled = true;
  selected = 'None';
  selectedproduct;

  @ViewChild('editCompanyModal', { static: true }) editCompanyModal: TemplateRef<any>;
  private editCompanyDialogRef: MatDialogRef<TemplateRef<any>>;

  companyControl = new FormControl('', Validators.required);
  productControl = new FormControl('', Validators.required);
  companyControl_Outsourced = new FormControl('');



  //myControl = new FormControl();
  //myControlCompany = new FormControl();
  //myControlCompany_Outsourced = new FormControl();

  ReceivedDateControl = new FormControl('', Validators.required);
  DeliveryDateControl = new FormControl('', Validators.required);
  ActualDeliveryDateControl = new FormControl();


  CostperpieceControl = new FormControl();
  discountControl = new FormControl();
  //options: string[] = ['One', 'Two', 'Three'];

  optionsCompany: any[];// = ['One', 'Two', 'Three'];
  optionsCompany_Outsourced: any[];// = ['One', 'Two', 'Three'];

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
  Quantity_Outsourced=0;
  bill_Outsourced = 0;
  order: Orders = {};

  GSTfromDB = 0;
  GSTUsed = 0;

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
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
    this.serviceService.GetAllOrders().subscribe(result => {
      this.DataLoaded = true;
      if (result.status == 200) {
        //this.orderList = result.body;
        console.log(result);
        if (result.body) {
          this.ArrangeOrders(result.body);
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

  public CorrectDates(orderList) {
    if (orderList && orderList.length > 0) {
      orderList.forEach(function (value) {
        if (value.ActualDeliveryDate == "0001-01-01T00:00:00")
          value.ActualDeliveryDate = "";
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
        this.GSTUsed = this.clickedRow.GSTPercent > 0 ? this.clickedRow.GSTPercent: this.GSTfromDB;
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

  public SetOrderDelivered(selecteditem) {
    this.isOrderDelivered = selecteditem;
    console.log(this.isOrderDelivered);

  }
  public SetDiscount(selecteditem) {
    this.IsDiscount = selecteditem;
    console.log(this.IsDiscount);

    if (!this.IsDiscount)
      this.discountControl.setValue("");
    this.discount = "";
  }

  public GetAllMasterData() {
    this.serviceService.GetAllMasterData().subscribe(result => {
      if (result.status == 200) {
        this.orderList = result.body;
        console.log(result);
        if (result.body) {
          this.serviceService.SetMasterData(result.body);

          if (result.body.Company && result.body.Company.length > 0) {
            //this.optionsCompany = result.body.Company;
            let company = result.body.Company;
            this.optionsCompany = company.filter(x => x.IsOutsourceCompany != true);
            this.optionsCompany_Outsourced = company.filter(x => x.IsOutsourceCompany == true);

          }

          if (result.body.Product && result.body.Product.length > 0) {
            this.optionsProduct = result.body.Product;
          }

          if (result.body.tax && result.body.tax > 0)
            this.GSTfromDB = result.body.tax;
          //localStorage.setItem('OrdersList', JSON.stringify(this.orderList));
          //this.CorrectDates(this.orderList);

          //this.dataSource = new MatTableDataSource(this.orderList);
          //this.dataSource.paginator = this.paginator;
          //this.dataSource.sort = this.sort;
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

  public ClearPopupdata() {
    //this.myControlCompany.value = "";
    //this.myControl.value = "";

    this.companyControl.setValue("");
    this.productControl.setValue("");

    

    this.numberFormControl.setValue("");
    this.Quantity = "";
    this.ReceivedDate = "";
    this.DeliveryDate = "";
    this.ActualDeliveryDate = "";
    this.GST = true;

    this.IsOrderOutsourced = false;
    this.IsDiscount = false;
    this.companyControl_Outsourced.setValue("");
    this.bill_Outsourced = 0;

    this.Quantity_Outsourced = 0;
    this.Quantity_OutsourcedControl.setValue("");
    this.bill_OutsourcedControl.setValue("");

    this.ReceivedDateControl.setValue("");
    this.DeliveryDateControl.setValue("");
    this.ActualDeliveryDateControl.setValue("");

    this.discountControl.setValue("");
    this.CostperpieceControl.setValue("");
    this.Costperpiece = "";
    this.discount = "";

    this.GSTUsed = this.GSTfromDB;

    this.companyControl.reset();
    this.productControl.reset();
    this.numberFormControl.reset();
    this.CostperpieceControl.reset();

    this.ReceivedDateControl.reset();
    this.DeliveryDateControl.reset();

  }

  public GetPopupselectedValues() {
    this.ClearPopupdata();
    if (this.clickedRow) {
      //this.companyControl.setValue(this.clickedRow.CompanyName);
      //this.productControl.setValue(1);
      this.orderStatus = "In Progress";
      if (this.clickedRow.Status == 1)
        this.orderStatus = "Delivered";
      else if (this.clickedRow.Status == 2)
        this.orderStatus = "Billed";

      this.companyControl.setValue(this.optionsCompany.filter(x => x.CompanyID == this.clickedRow.SN_CompanyID)[0]);
      this.productControl.setValue(this.optionsProduct.filter(x => x.ProductID == this.clickedRow.SN_ProductID)[0]);

      this.Quantity = this.clickedRow.Quantity;
      this.numberFormControl.setValue(this.clickedRow.Quantity);

      this.ReceivedDate = this.clickedRow.ReceivedDate;
      this.DeliveryDate = this.clickedRow.ExpectedDeliveryDate;
      this.ActualDeliveryDate = this.clickedRow.ActualDeliveryDate;

      this.ReceivedDateControl.setValue(this.clickedRow.ReceivedDate);
      this.DeliveryDateControl.setValue(this.clickedRow.ExpectedDeliveryDate);
      this.ActualDeliveryDateControl.setValue(this.clickedRow.ActualDeliveryDate);

      this.GST = this.clickedRow.isTaxable;

      this.IsOrderOutsourced = this.clickedRow.IsOrderOutsourced;
      if (this.clickedRow.Discount && this.clickedRow.Discount > 0) {
        this.IsDiscount = true;
        this.discountControl.setValue(this.clickedRow.Discount);
        this.discount = this.clickedRow.Discount;
      }
      this.companyControl_Outsourced.setValue(this.optionsCompany.filter(x => x.CompanyID == this.clickedRow.OutsourceCompanyID)[0]);

      this.Quantity_Outsourced = this.clickedRow.OutsourceQuantity;
      this.Quantity_OutsourcedControl.setValue(this.clickedRow.OutsourceQuantity);

      this.bill_Outsourced = this.clickedRow.OutsourceBill;
      this.bill_OutsourcedControl.setValue(this.clickedRow.OutsourceBill);

      this.CostperpieceControl.setValue(this.clickedRow.CostperPiece);
      this.Costperpiece = this.clickedRow.CostperPiece;

      //this.CalculateGSTCharges();
      this.GSTUsed = this.clickedRow.GSTPercent;
    }
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


  public SaveOrder() {

    let receivedDate = new Date(this.ReceivedDateControl.value);
    let expecteddeliveryDate = new Date(this.DeliveryDateControl.value);
    let actualdeliveryDate;
    if (this.ActualDeliveryDateControl.value)
    actualdeliveryDate = new Date(this.ActualDeliveryDateControl.value);

    if (receivedDate > expecteddeliveryDate) {
      this.serviceService.openSnackBarRed("Expected delivery date can't be less than received date");
    }
    else if (this.ActualDeliveryDateControl.value && (receivedDate > actualdeliveryDate)) {
      this.serviceService.openSnackBarRed("Actual delivery date can't be less than received date");

    }
    else {

      if (!this.ActualDeliveryDateControl || !this.ActualDeliveryDateControl.value)
        this.order.Status = 0;
      else if (!this.isOrderDelivered)
        this.order.Status = 1
      else
        this.order.Status = 2



    let user = this.userDetails;
    this.order.UserID = user.UserID;

    this.order.SN_CompanyID = this.companyControl.value.CompanyID;
    this.order.SN_ProductID = this.productControl.value.ProductID;
    this.order.Quantity = this.numberFormControl.value;
    //this.order.ReceivedDate = this.ReceivedDateControl.value;
    //this.order.ExpectedDeliveryDate = this.DeliveryDateControl.value;
    //this.order.ActualDeliveryDate = this.ActualDeliveryDateControl.value;

    this.order.ReceivedDate = this.datePipe.transform(this.ReceivedDateControl.value, 'yyyy-MM-dd');
    this.order.ExpectedDeliveryDate = this.datePipe.transform(this.DeliveryDateControl.value, 'yyyy-MM-dd');
    this.order.ActualDeliveryDate = this.datePipe.transform(this.ActualDeliveryDateControl.value, 'yyyy-MM-dd');
    //this.order.CostperPiece =
    //this.order.TotalPrice =
    //this.order.Discount =
    this.order.isTaxable = this.GST;

    //this.order.IsActive =
    //  this.order.CreatedBy =
    //  this.order.CreatedDate =
    //  this.order.ModifiedBy =
    //  this.order.ModifiedDate =

    //this.order.IsOrderRejected =
    //this.order.OrderRejectedReason =
    this.order.IsOrderOutsourced = this.IsOrderOutsourced;
    if (this.IsDiscount)
      this.order.Discount = this.discountControl.value;
    else
      this.order.Discount = 0;

    if (this.companyControl_Outsourced.value)
      this.order.OutsourceCompanyID = this.companyControl_Outsourced.value.CompanyID;
    this.order.OutsourceQuantity = this.Quantity_OutsourcedControl.value;
    this.order.OutsourceBill = this.bill_OutsourcedControl.value;

    this.order.CostperPiece = this.CostperpieceControl.value;
    this.order.Discount = this.discountControl.value;




    if (this.AddUpdateButton == "Update") {
      this.order.OrderID = this.clickedRow.OrderID;
      //this.order.GSTPercent = this.clickedRow.GSTPercent;
    }
    else {
      this.order.OrderID = 0;
      //this.order.GSTPercent = this.GSTfromDB;

    }
    this.order.GSTPercent = this.CalculateGSTPercent();

    this.order.TotalPrice = this.CalculateTotalPrice();

    console.log(this.order);
    this.serviceService.SaveOrder(this.order).subscribe(result => {
      if (result.status == 200) {
        console.log(result);
        this.dialog.closeAll();
        this.isEditDisabled = true;
        this.isDeleteDisabled = true;

        if (result.body) {
          this.serviceService.openSnackBarGreen("Order details saved Successfully!!");
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
  }

  CalculateTotalPrice() {
    let totalwotax = (this.CostperpieceControl.value * this.numberFormControl.value);
    let gstCharges = this.GST? ((totalwotax * this.order.GSTPercent) / 100) : 0;

    let total = totalwotax + gstCharges;

    if (this.discountControl.value && this.discountControl.value > 0)
      total = total - this.discountControl.value;

    return total;
  }

  private ArrangeOrders(orderList) {
    this.orderList = orderList;

    this.CorrectDates(this.orderList);

    this.dataSource = new MatTableDataSource(this.orderList);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.GetAllMasterData();
  }

  //public ProductChanged(val) {
  //  let a = this.myControl.value;
  //  let b = this.option;
  //  let selectedProduct = this.optionsProduct.filter(x => x.ProductName == val);
  //  if (selectedProduct && selectedProduct.length > 0) {
  //    this.CostperpieceControl.setValue(selectedProduct[0].CostperPiece);
  //    this.Costperpiece = selectedProduct[0].CostperPiece;
  //  }
  //}

  public ProductChanged(test) {
    console.log(test);
    this.CostperpieceControl.setValue(test.CostperPiece);
  }

  public DeleteOrder() {
    let user = this.userDetails;
    let UserID = user.UserID;

    let  OrderID = this.clickedRow.OrderID;

    this.serviceService.DeleteOrder(OrderID, UserID).subscribe(result => {
      if (result.status == 200) {
        console.log(result);

        if (result.body) {
          this.serviceService.openSnackBarGreen("Order deleted Successfully!!");
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

  public DeliveryDateChanged() {
    alert(this.ActualDeliveryDateControl.value);
  }
}



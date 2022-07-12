import { Injectable } from '@angular/core';
import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
//import { } from '@angular/'
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  private API_URL = environment.API_URL + '/api/';
  private userData;
  private masterData;
  private durationsnackbar=3000;

  constructor(private router: Router, private _snackBar: MatSnackBar, private http: HttpClient) {

  }

  public UserValidation(username, password) {
    return this.http.get<any>(this.API_URL + 'UserValidation/' + username + '/' + password,
      {
        observe: 'response'
      });
  }

  public DeleteOrder(OrderID, UserID) {
    return this.http.get<any>(this.API_URL + 'DeleteOrder/' + OrderID + '/' + UserID,
      {
        observe: 'response'
      });
  }

  public DeleteCompany(CompanyID, UserID) {
    return this.http.get<any>(this.API_URL + 'DeleteCompany/' + CompanyID + '/' + UserID,
      {
        observe: 'response'
      });
  }

  public DeleteProduct(ProductID, UserID) {
    return this.http.get<any>(this.API_URL + 'DeleteProduct/' + ProductID + '/' + UserID,
      {
        observe: 'response'
      });
  }


  public DeleteUser(UserIDtochange, UserID) {
    return this.http.get<any>(this.API_URL + 'DeleteUser/' + UserIDtochange + '/' + UserID,
      {
        observe: 'response'
      });
  }


  public GetAllOrders() {
    return this.http.get<any>(this.API_URL + 'GetAllOrders',
      {
        observe: 'response'
      });
  }


  public GetAllCompany() {
    return this.http.get<any>(this.API_URL + 'GetAllCompany',
      {
        observe: 'response'
      });
  }

  public GetAllProduct() {
    return this.http.get<any>(this.API_URL + 'GetAllProduct',
      {
        observe: 'response'
      });
  }

  public GetAllUser() {
    return this.http.get<any>(this.API_URL + 'GetAllUser',
      {
        observe: 'response'
      });
  }


  public SaveOrder(orders) {
    return this.http.post<any>(this.API_URL + 'InsertUpdateOrder', orders,
      {
        observe: 'response'
      });
  }

  public SaveCompany(orders) {
    return this.http.post<any>(this.API_URL + 'InsertUpdateCompany', orders,
      {
        observe: 'response'
      });
  }

  public SaveProduct(orders) {
    return this.http.post<any>(this.API_URL + 'InsertUpdateProduct', orders,
      {
        observe: 'response'
      });
  }

  public SaveUser(orders) {
    return this.http.post<any>(this.API_URL + 'InsertUpdateUser', orders,
      {
        observe: 'response'
      });
  }

  public GetAllMasterData() {
    return this.http.get<any>(this.API_URL + 'GetAllGetAllCompanyProductTax',
      {
        observe: 'response'
      });
  }

  public GetLoginUserDetails() {
    var userDataObject = localStorage.getItem('UserData');
    console.log('retrievedObject: ', JSON.parse(userDataObject));
    let datafromLocalStorage = JSON.parse(userDataObject);

    if (datafromLocalStorage)
      return datafromLocalStorage;
    else
    return this.userData
  }

  public SetLoginUserDetails(userData, IsRememberme) {
    if (IsRememberme)
      localStorage.setItem('UserData', JSON.stringify(userData));

    this.userData = userData
  }

  public clearAllLocalStorageData() {
    localStorage.clear();

    this.userData = null;
  }

  public SetMasterData(userData) {
    this.masterData = userData
  }

  public GetMasterData() {
    return this.masterData
  }

  public openSnackBarRed(message) {
    this._snackBar.open(message, '',
      {
        duration: this.durationsnackbar,
        panelClass: ['snackbarred']
      });
  }

  public openSnackBarGreen(message) {
    this._snackBar.open(message, '',
      {
        duration: this.durationsnackbar,
        panelClass: ['snackbargreen']
      });
  }

  public openSnackBarYellow(message) {
    this._snackBar.open(message, '',
      {
        duration: this.durationsnackbar,
        panelClass: ['snackbaryellow']
      });
  }

  public NavigatetoPage(pagename) {
    let userDetails = this.GetLoginUserDetails();


    if (userDetails && userDetails.UserName)
      this.router.navigate([pagename]);
    else
      this.router.navigate(['login']);
  }


  public SaveContacts(Name, Email, Message) {
    return this.http.get<any>(this.API_URL + 'InsertContacts/' + Name + '/' + Email + '/' + Message,
      {
        observe: 'response'
      });
  }

  public GetAllContacts() {
    return this.http.get<any>(this.API_URL + 'GetAllContacts',
      {
        observe: 'response'
      });
  }

  public GetReportData(company, product, year) {
    return this.http.get<any>(this.API_URL + 'GetReportData/' + company + '/' + product + '/' + year,
      {
        observe: 'response'
      });
  }
}

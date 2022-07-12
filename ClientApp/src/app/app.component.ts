import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceService } from '../app/Services/service.service';

interface Food {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'app';
  UserName = "Login";
  isHomePage = true;
  isLoginPage = false;

  pagename = "";
  userDetails;
  LoggedinUserName;

  foods: Food[] = [
    { value: 'steak-0', viewValue: '' },
    { value: 'Profile', viewValue: 'Profile' },
    { value: 'Logout', viewValue: 'Logout' }
  ];

  constructor(private router: Router, private serviceService: ServiceService) {
  }

  ngOnInit() {
    //console.log(window.location.href);
    //this.pagename = window.location.href;

    //if ((this.pagename.indexOf("orders") !== -1) || (this.pagename.indexOf("user") !== -1) || (this.pagename.indexOf("contacts") !== -1)
    //  || (this.pagename.indexOf("product") !== -1) || (this.pagename.indexOf("company") !== -1) || (this.pagename.indexOf("login") !== -1) || (this.pagename.indexOf("report") !== -1)   )
    //  this.isHomePage = false;
    //else
    //  this.isHomePage = true;

    //if (this.pagename.indexOf("login") !== -1)
    //  this.isLoginPage = true;
  }
//  public Login() {
//    this.isHomePage = false;

//    //this.GetUserDetails();
//    this.userDetails = this.serviceService.GetLoginUserDetails();


//    if (this.userDetails && this.userDetails.UserName) {
//      this.isLoginPage = false;
//      this.router.navigate(['orders']);
//    }
//    else
//      this.router.navigate(['login']);
//  }

//  public Home() {
//    this.isHomePage = true;
//    this.router.navigate(['home']);
//    this.isLoginPage = false;

//  }
//  public GetUserDetails() {
//    var userDataObject = localStorage.getItem('UserData');
//    console.log('retrievedObject: ', JSON.parse(userDataObject));
//    this.userDetails = JSON.parse(userDataObject);

//    if (this.userDetails && this.userDetails.UserName)
//      this.LoggedinUserName = this.userDetails.Name;
//  }
//  public Logout() {
//    this.serviceService.clearAllLocalStorageData();
      
//      this.router.navigate(['login']);
//  }
}

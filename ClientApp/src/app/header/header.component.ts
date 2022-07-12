import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceService } from '../../app/Services/service.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  UserName = "Login";
  isHomePage = true;
  isLoginPage = false;

  pagename = "";
  userDetails;
  LoggedinUserName;

  headerbackgroundblur = true;

  constructor(private router: Router, private serviceService: ServiceService) { }

  ngOnInit() {
    console.log(window.location.href);
    this.pagename = window.location.href;

    if ((this.pagename.indexOf("orders") !== -1) || (this.pagename.indexOf("user") !== -1) || (this.pagename.indexOf("contacts") !== -1)
      || (this.pagename.indexOf("product") !== -1) || (this.pagename.indexOf("company") !== -1) || (this.pagename.indexOf("login") !== -1) || (this.pagename.indexOf("report") !== -1))
      this.isHomePage = false;
    else
      this.isHomePage = true;

    if (this.pagename.indexOf("login") !== -1)
      this.isLoginPage = true;
  }
  public Login() {
    this.isHomePage = false;

    //this.GetUserDetails();
    this.userDetails = this.serviceService.GetLoginUserDetails();


    if (this.userDetails && this.userDetails.UserName) {
      this.isLoginPage = false;
      this.UserName = this.userDetails.UserName;
      this.router.navigate(['orders']);
      console.log(this.userDetails.UserName);
    }
    else
      this.router.navigate(['login']);
  }

  public Home() {
    this.isHomePage = true;
    this.router.navigate(['home']);
    this.isLoginPage = false;

  }
  public GetUserDetails() {
    var userDataObject = localStorage.getItem('UserData');
    console.log('retrievedObject: ', JSON.parse(userDataObject));
    this.userDetails = JSON.parse(userDataObject);

    if (this.userDetails && this.userDetails.UserName)
      this.LoggedinUserName = this.userDetails.Name;
  }
  public Logout() {
    this.serviceService.clearAllLocalStorageData();

    this.router.navigate(['login']);
  }

}

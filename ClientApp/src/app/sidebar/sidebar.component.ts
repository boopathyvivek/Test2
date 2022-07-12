import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../../app/Services/service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  userDetails;
  Accesslevel = 0;
  pagename = "";

  Orders = false;
  user = false;
  contacts = false;
  product = false;
  company = false;
  report = false;

  constructor(private router: Router, private serviceService: ServiceService) {
    this.pagename = window.location.href;
    console.log(this.pagename);

    if ((this.pagename.indexOf("orders") !== -1)){
      this.Orders = true;
      this.user = false;
      this.contacts = false;
      this.product = false;
      this.company = false;
      this.report = false;

    }
    if ((this.pagename.indexOf("user") !== -1))
      {
      this.Orders = false;
      this.user = true;
      this.contacts = false;
      this.product = false;
      this.report = false;
      this.company = false;
    }
    if ((this.pagename.indexOf("contacts") !== -1))
     {
      this.Orders = false;
      this.user = false;
      this.contacts = true;
      this.product = false;
      this.report = false;
      this.company = false;
    }
    if ((this.pagename.indexOf("product") !== -1))
      {
      this.Orders = false;
      this.user = false;
      this.contacts = false;
      this.product = true;
      this.report = false;
      this.company = false;
    }
    if ((this.pagename.indexOf("company") !== -1))
      {
      this.Orders = false;
      this.user = false;
      this.contacts = false;
      this.product = false;
      this.report = false;
      this.company = true;
    }
    if ((this.pagename.indexOf("report") !== -1)) {
      this.Orders = false;
      this.user = false;
      this.contacts = false;
      this.product = false;
      this.report = true;
      this.company = false;
    }
  }

  ngOnInit() {
    this.userDetails = this.serviceService.GetLoginUserDetails();

    this.Accesslevel = this.userDetails.AccessLevel;
  }

  public NavigatetoPage(pagename) {
    this.serviceService.NavigatetoPage(pagename);
  }
}

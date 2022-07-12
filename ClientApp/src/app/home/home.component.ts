import { Component, OnInit, HostBinding } from '@angular/core';
import { ServiceService } from '../Services/service.service';
import { Router } from '@angular/router';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  // ...
} from '@angular/animations';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogBoxComponent} from '../dialog-box/dialog-box.component';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit{
  blog1Head = "Successful Slotting With Miniature Cutting Tools";
  blog2Head = "Titanium Machining Cost Savings With Helical Solutions";
  blog3Head = "Hardenability of Steel";

  blog1URL = "https://www.harveyperformance.com/in-the-loupe/successful-slotting-with-miniature-cutting-tools/";
  blog2URL = "https://www.harveyperformance.com/in-the-loupe/titanium-machining-cost-savings/";
  blog3URL = "https://www.harveyperformance.com/in-the-loupe/hardenability-of-steel/";

  Name;
  Email;
  Message;
  constructor(private router: Router, private serviceService: ServiceService, public dialog: MatDialog) {
  }
  ngOnInit() {
    this.setCurrentLocation();
  }

  // Get Current Location Coordinates
  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
      });
    }
  }

  public SendMessage() {
    if (this.Name && this.Email && this.Message && this.Name.length > 1 && this.Email.length > 4 && this.Message.length > 24) {
      this.serviceService.SaveContacts(this.Name, this.Email, this.Message).subscribe(result => {
        if (result.status == 200) {
          console.log(result);

          if (result.body) {
            this.serviceService.openSnackBarGreen("Message sent Successfully!!");
            this.ClearAllFields();
          }
          else
            this.serviceService.openSnackBarRed("Some technical fault. Please contact Mobile no given below.");

        }
        else {
          this.serviceService.openSnackBarRed("Some technical fault. Please contact Mobile no given below.");
        }
      }), error => console.error(error);

    }
    else {
      this.serviceService.openSnackBarRed("Please fill all fields to proceed.");
    }
  }

  private ClearAllFields() {
    this.Name = "";
    this.Email = "";
    this.Message = "";

  }

  public Login() {

    //this.GetUserDetails();
    let userDetails = this.serviceService.GetLoginUserDetails();


    if (userDetails && userDetails.UserName) {
      this.router.navigate(['orders']);
    }
    else
      this.router.navigate(['login']);
  }



  openDialog(from): void {
    let head = "";
    let body = "";

    if (from == "blog1") {
      head = this.blog1Head;
      body = this.blog1URL;
    }
    else if (from == "blog2") {
      head = this.blog2Head;
      body = this.blog2URL;
    }
    else if (from == "blog3") {
      head = this.blog3Head;
      body = this.blog3URL;
    }

    const dialogRef = this.dialog.open(DialogBoxComponent, {
      //width: '250px',
      data: { head: head, body: body, from: 'blog' }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}

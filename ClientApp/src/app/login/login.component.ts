import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { MatDialog } from '@angular/material'
import { ServiceService } from '../Services/service.service';

import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router, private serviceService: ServiceService) { }

  username: string;
  password: string;
  userData: any;

  IsRememberme = false;
  ngOnInit() {
  }

  login(): void {

  }

  UserValidation(): void {

    if (this.username && this.password) {

      this.userData = [];
      console.log(this.username);
      console.log(this.IsRememberme);
      this.serviceService.UserValidation(this.username, this.password).subscribe(result => {
        if (result.status == 200) {
          this.userData = result;
          console.log(result);
          if (result.body.IsActive) {
            this.serviceService.openSnackBarGreen("Successfully logged in!!");

            //localStorage.setItem('UserData', JSON.stringify(this.userData.body));
            this.serviceService.SetLoginUserDetails(this.userData.body, this.IsRememberme);
            this.router.navigate(['orders']);


            //var userDataObject = localStorage.getItem('UserData');
            //console.log('retrievedObject: ', JSON.parse(userDataObject));
          }
          else {
            //alert("Invalid Username or Password. Please contact admin.");
            this.serviceService.openSnackBarRed("Invalid Username or Password. Please contact admin for more info.");
          }
        }
        else {
          this.serviceService.openSnackBarRed("Some error occured. Please contact admin for more info.");
        }

      }), error => console.error(error);

    }
    else {
      this.serviceService.openSnackBarRed("Please enter both Username and Password.");
    }
  }

  SetRememberme(value) {
    this.IsRememberme = value;
    console.log(this.IsRememberme);

  }
}

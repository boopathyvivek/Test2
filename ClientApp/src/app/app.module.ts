import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { CounterComponent } from './counter/counter.component';
import { FetchDataComponent } from './fetch-data/fetch-data.component';
import { AgmCoreModule } from '@agm/core';
import { OrderComponent } from './orders/order/order.component';
import { OrdersComponent } from './orders/orders.component';

import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table'
import { MatPaginatorModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatSortModule } from '@angular/material/sort';
import { LoginComponent } from './login/login.component';

import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material';
import { SidebarComponent } from './sidebar/sidebar.component';
import { MatCheckboxModule } from '@angular/material'
import { MatSelectModule, MatButtonToggleModule, MatFormFieldModule, MatNativeDateModule  } from '@angular/material';
import { MatDialogModule } from '@angular/material/dialog';

//import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { DatePipe } from '@angular/common';
import { CompanyComponent } from './company/company.component';
import { ProductComponent } from './product/product.component';
import { UsersComponent } from './users/users.component';
import { ContactsComponent } from './contacts/contacts.component';
import { HeaderComponent } from './header/header.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ReportComponent } from './report/report.component';
import { MatRadioModule } from '@angular/material';
import { NgApexchartsModule } from 'ng-apexcharts';
import { PieChartComponent } from './Chart/pie-chart/pie-chart.component';
import { BarChartComponent } from './Chart/bar-chart/bar-chart.component';
import { MixedBarChartComponent } from './Chart/mixed-bar-chart/mixed-bar-chart.component';
import { BarMarkerChartComponent } from './Chart/bar-marker-chart/bar-marker-chart.component';
import { DialogBoxComponent } from './dialog-box/dialog-box.component';

//import { SnackbarComponent } from './Templates/snackbar/snackbar.component';
@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    CounterComponent,
    FetchDataComponent,
    OrderComponent,
    OrdersComponent,
    LoginComponent,
    SidebarComponent,
    CompanyComponent,
    ProductComponent,
    UsersComponent,
    ContactsComponent,
    HeaderComponent,
    ReportComponent,
    PieChartComponent,
    BarChartComponent,
    MixedBarChartComponent,
    BarMarkerChartComponent,
    DialogBoxComponent
  ],
  entryComponents: [DialogBoxComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule, ReactiveFormsModule,
    FormsModule, MatAutocompleteModule,
    MatInputModule, MatTableModule, MatPaginatorModule, BrowserAnimationsModule, MatSortModule, MatCardModule,
    MatProgressSpinnerModule, MatButtonModule, MatIconModule, MatCheckboxModule, MatSelectModule, MatDialogModule,
    MatDatepickerModule, MatButtonToggleModule, MatFormFieldModule, MatNativeDateModule,
    MatSnackBarModule, MatTooltipModule, MatRadioModule, NgApexchartsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCqMlMjFVBkhifqhsNejy4mC88uC_pENBs'
    }),
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'home', component: HomeComponent },

      { path: 'counter', component: CounterComponent },
      { path: 'fetch-data', component: FetchDataComponent },
      { path: 'login', component: LoginComponent },

      { path: 'orders', component: OrdersComponent },
      { path: 'company', component: CompanyComponent },
      { path: 'product', component: ProductComponent },
      { path: 'user', component: UsersComponent },
      { path: 'contacts', component: ContactsComponent },
      { path: 'report', component: ReportComponent },

      { path: '**', redirectTo: '/' }




    ])
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }

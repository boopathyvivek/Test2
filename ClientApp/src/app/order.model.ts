export class Order {
}
export interface UserData {
  id: string;
  name: string;
  progress: string;
  fruit: string;
}

export interface Orders {
  OrderID?: any;
  SN_CompanyID?: any;
  SN_ProductID?: any;
  Quantity?: any;
  Status?: any;

  ReceivedDate?: any;
  ExpectedDeliveryDate?: any;
  ActualDeliveryDate?: any;

  CostperPiece?: any;
  TotalPrice?: any;
  Discount?: any;
  isTaxable?: any;

  GSTPercent?: any;

  IsActive?: any;
  //CreatedBy: any;
  //CreatedDate: any;
  //ModifiedBy: any;
  //ModifiedDate: any;

  UserID?: any;

  IsOrderRejected?: any;
  OrderRejectedReason?: any;
  IsOrderOutsourced?: any;

  OutsourceCompanyID?: any;
  OutsourceQuantity?: any;
  OutsourceBill?: any;

  CompanyName?: any;
  ProductName?: any;
  CompanyName_Outsource?: any;

}

export interface Company {
  CompanyID?: any;
  CompanyName?: any;
  POC?: any;
  Mobile1?: any;

  Mobile2?: any;
  Email?: any;
  Address?: any;

  UserID?: any;
  IsOutsourceCompany?: any;

}

export interface Product {
  ProductID?: any;
  ProductName?: any;
  Description?: any;
  CostperPiece?: any;

  IsWeightedinKG?: any;

  UserID?: any;

}


export interface User {
  UserIDtochange?: any;
  UserName?: any;
  Name?: any;
  Password?: any;

  Mobile?: any;
  Email?: any;
  AccessLevel?: any;
  ImageURL?: any;

  UserID?: any;

}

export interface ReportitemLevel1 {
  ItemId: number;
  ItemName: string;
  ItemValue: number;
}

export interface ReportitemLevel2 {
  ItemId: number;
  ItemName: string;
  ItemValue: number;
  ItemValue2: number;
}


import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Category {
  'id' : bigint,
  'name' : string,
  'company_id' : bigint,
}
export interface Company {
  'id' : bigint,
  'is_public' : boolean,
  'owner' : Principal,
  'city' : string,
  'name' : string,
  'description' : [] | [string],
  'created_at' : bigint,
  'email' : [] | [string],
  'state' : string,
  'gstin' : string,
  'address' : string,
  'phone' : [] | [string],
  'pincode' : string,
}
export interface CompanyRetailerConnection {
  'id' : bigint,
  'connected_at' : bigint,
  'status' : string,
  'retailer_id' : bigint,
  'approved_at' : [] | [bigint],
  'approved_by' : [] | [Principal],
  'company_id' : bigint,
  'credit_limit' : number,
  'payment_terms' : string,
}
export interface Employee {
  'id' : bigint,
  'contact' : string,
  'retailer_id' : [] | [bigint],
  'user' : Principal,
  'truck_id' : [] | [bigint],
  'company_id' : bigint,
}
export interface Invoice {
  'id' : bigint,
  'irn' : string,
  'invoice_number' : string,
  'payment_mode' : string,
  'retailer_id' : bigint,
  'grand_total' : number,
  'invoice_date' : bigint,
  'total_cgst' : number,
  'total_taxable_value' : number,
  'total_igst' : number,
  'payment_status' : string,
  'total_sgst' : number,
  'due_date' : [] | [bigint],
  'is_einvoice_generated' : boolean,
  'items' : Array<InvoiceItem>,
  'company_id' : bigint,
}
export interface InvoiceItem {
  'id' : bigint,
  'gst_rate' : number,
  'invoice_id' : bigint,
  'product_id' : bigint,
  'taxable_value' : number,
  'cgst' : number,
  'igst' : number,
  'sgst' : number,
  'quantity' : bigint,
  'price' : number,
  'hsn_code' : string,
}
export interface Order {
  'id' : bigint,
  'status' : string,
  'retailer_id' : bigint,
  'order_date' : bigint,
  'items' : Array<OrderItem>,
}
export interface OrderItem {
  'id' : bigint,
  'product_id' : bigint,
  'quantity' : bigint,
  'order_id' : bigint,
}
export interface Product {
  'id' : bigint,
  'uqc' : string,
  'status' : string,
  'name' : string,
  'total_required_quantity' : bigint,
  'created_by' : [] | [Principal],
  'igst_rate' : number,
  'total_shipped' : bigint,
  'cgst_rate' : number,
  'price' : number,
  'cess_rate' : number,
  'company_id' : bigint,
  'available_quantity' : bigint,
  'sgst_rate' : number,
  'hsn_code' : string,
  'category_id' : [] | [bigint],
}
export type Result = { 'ok' : string } |
  { 'err' : string };
export type Result_1 = { 'ok' : Shipment } |
  { 'err' : string };
export type Result_10 = { 'ok' : Array<Retailer> } |
  { 'err' : string };
export type Result_11 = {
    'ok' : {
      'connected_companies' : bigint,
      'pending_requests' : bigint,
      'total_orders' : bigint,
    }
  } |
  { 'err' : string };
export type Result_12 = { 'ok' : Array<Product> } |
  { 'err' : string };
export type Result_13 = { 'ok' : Array<Order> } |
  { 'err' : string };
export type Result_14 = { 'ok' : Array<Invoice> } |
  { 'err' : string };
export type Result_15 = { 'ok' : bigint } |
  { 'err' : string };
export type Result_16 = { 'ok' : Array<Employee> } |
  { 'err' : string };
export type Result_17 = {
    'ok' : {
      'orders_placed' : bigint,
      'retailers_available' : bigint,
      'pending_orders' : bigint,
      'employees_available' : bigint,
    }
  } |
  { 'err' : string };
export type Result_18 = { 'ok' : Array<CompanyRetailerConnection> } |
  { 'err' : string };
export type Result_19 = { 'ok' : Array<Company> } |
  { 'err' : string };
export type Result_2 = { 'ok' : RetailerProfile } |
  { 'err' : string };
export type Result_20 = { 'ok' : Array<Category> } |
  { 'err' : string };
export type Result_21 = { 'ok' : Truck } |
  { 'err' : string };
export type Result_22 = { 'ok' : Invoice } |
  { 'err' : string };
export type Result_23 = { 'ok' : Employee } |
  { 'err' : string };
export type Result_24 = { 'ok' : Retailer } |
  { 'err' : string };
export type Result_3 = { 'ok' : Product } |
  { 'err' : string };
export type Result_4 = { 'ok' : Order } |
  { 'err' : string };
export type Result_5 = { 'ok' : Company } |
  { 'err' : string };
export type Result_6 = { 'ok' : Category } |
  { 'err' : string };
export type Result_7 = { 'ok' : User } |
  { 'err' : string };
export type Result_8 = { 'ok' : Array<Truck> } |
  { 'err' : string };
export type Result_9 = { 'ok' : Array<Shipment> } |
  { 'err' : string };
export interface Retailer {
  'id' : bigint,
  'retailer_profile_id' : [] | [bigint],
  'updated_at' : bigint,
  'contact' : string,
  'country' : string,
  'address_line1' : string,
  'address_line2' : [] | [string],
  'contact_person' : [] | [string],
  'city' : string,
  'name' : string,
  'distance_from_warehouse' : number,
  'created_at' : bigint,
  'email' : [] | [string],
  'state' : string,
  'gstin' : string,
  'is_active' : boolean,
  'pincode' : string,
  'company_id' : bigint,
}
export interface RetailerProfile {
  'id' : bigint,
  'updated_at' : bigint,
  'country' : string,
  'address_line1' : string,
  'address_line2' : [] | [string],
  'contact_person' : string,
  'city' : string,
  'user' : Principal,
  'business_name' : string,
  'business_type' : [] | [string],
  'created_at' : bigint,
  'email' : string,
  'state' : string,
  'is_verified' : boolean,
  'gstin' : [] | [string],
  'phone' : string,
  'pincode' : string,
  'established_year' : [] | [bigint],
}
export interface Shipment {
  'id' : bigint,
  'status' : string,
  'shipment_date' : bigint,
  'order_id' : bigint,
  'employee_id' : [] | [bigint],
}
export interface Truck {
  'id' : bigint,
  'license_plate' : string,
  'is_available' : boolean,
  'capacity' : bigint,
  'company_id' : bigint,
}
export interface User {
  'id' : Principal,
  'password_hash' : string,
  'groups' : Array<string>,
  'username' : string,
  'created_at' : bigint,
  'email' : string,
  'is_staff' : boolean,
}
export interface _SERVICE {
  'acceptRetailerRequest' : ActorMethod<
    [bigint, string, number, string],
    Result
  >,
  'addRetailer' : ActorMethod<
    [
      bigint,
      string,
      [] | [string],
      [] | [string],
      string,
      string,
      [] | [string],
      string,
      string,
      string,
      string,
      string,
      number,
    ],
    Result_24
  >,
  'allocateOrder' : ActorMethod<[bigint, bigint], Result>,
  'approveOrder' : ActorMethod<[bigint], Result_1>,
  'createCategory' : ActorMethod<[bigint, string], Result_6>,
  'createCompany' : ActorMethod<
    [
      string,
      string,
      string,
      string,
      string,
      string,
      [] | [string],
      [] | [string],
      boolean,
      [] | [string],
    ],
    Result_5
  >,
  'createEmployee' : ActorMethod<
    [bigint, [] | [bigint], string, [] | [bigint]],
    Result_23
  >,
  'createInvoice' : ActorMethod<
    [
      string,
      bigint,
      bigint,
      bigint,
      [] | [bigint],
      string,
      Array<
        [bigint, bigint, number, number, number, number, number, number, string]
      >,
    ],
    Result_22
  >,
  'createOrder' : ActorMethod<[bigint, Array<[bigint, bigint]>], Result_4>,
  'createProduct' : ActorMethod<
    [
      bigint,
      string,
      [] | [bigint],
      bigint,
      string,
      number,
      string,
      number,
      number,
      number,
      number,
    ],
    Result_3
  >,
  'createRetailerProfile' : ActorMethod<
    [
      string,
      string,
      string,
      string,
      string,
      [] | [string],
      string,
      string,
      string,
      string,
      [] | [string],
      [] | [string],
      [] | [bigint],
    ],
    Result_2
  >,
  'createTruck' : ActorMethod<[bigint, string, bigint], Result_21>,
  'deleteCategory' : ActorMethod<[bigint], Result>,
  'deleteCompany' : ActorMethod<[bigint], Result>,
  'deleteProduct' : ActorMethod<[bigint], Result>,
  'forgotPassword' : ActorMethod<[string, string], Result>,
  'getCategories' : ActorMethod<[[] | [bigint]], Result_20>,
  'getCategoryStockData' : ActorMethod<
    [],
    Array<{ 'value' : bigint, 'name' : string }>
  >,
  'getCompanies' : ActorMethod<[], Result_19>,
  'getCompanyConnections' : ActorMethod<[bigint, string], Result_18>,
  'getCounts' : ActorMethod<[bigint], Result_17>,
  'getEmployeeShipments' : ActorMethod<[], Result_9>,
  'getEmployees' : ActorMethod<[[] | [bigint]], Result_16>,
  'getInvoiceCount' : ActorMethod<[bigint], Result_15>,
  'getInvoices' : ActorMethod<[[] | [bigint]], Result_14>,
  'getLoggedInUser' : ActorMethod<[], Result_7>,
  'getOrders' : ActorMethod<[[] | [string]], Result_13>,
  'getOrdersByRetailer' : ActorMethod<[bigint], Result_13>,
  'getProducts' : ActorMethod<[[] | [bigint]], Result_12>,
  'getPublicCompanies' : ActorMethod<[], Array<Company>>,
  'getRetailerCounts' : ActorMethod<[], Result_11>,
  'getRetailerProfile' : ActorMethod<[], Result_2>,
  'getRetailers' : ActorMethod<[[] | [bigint]], Result_10>,
  'getShipments' : ActorMethod<[], Result_9>,
  'getTrucks' : ActorMethod<[[] | [bigint]], Result_8>,
  'health' : ActorMethod<[], string>,
  'login' : ActorMethod<[string, string], Result>,
  'logout' : ActorMethod<[], Result>,
  'register' : ActorMethod<[string, string, string, Array<string>], Result_7>,
  'requestCompanyApproval' : ActorMethod<[bigint, string], Result>,
  'resetPassword' : ActorMethod<[string, string, string], Result>,
  'storeQRCode' : ActorMethod<[string], Result>,
  'updateCategory' : ActorMethod<[bigint, string], Result_6>,
  'updateCompany' : ActorMethod<
    [
      bigint,
      string,
      string,
      string,
      string,
      string,
      string,
      [] | [string],
      [] | [string],
      boolean,
      [] | [string],
    ],
    Result_5
  >,
  'updateOrderStatus' : ActorMethod<[bigint, string], Result_4>,
  'updateProductQuantity' : ActorMethod<
    [bigint, bigint, bigint, bigint],
    Result_3
  >,
  'updateRetailerProfile' : ActorMethod<
    [
      string,
      string,
      string,
      string,
      string,
      [] | [string],
      string,
      string,
      string,
      string,
      [] | [string],
      [] | [string],
      [] | [bigint],
    ],
    Result_2
  >,
  'updateShipmentStatus' : ActorMethod<[bigint, string], Result_1>,
  'verifyOTP' : ActorMethod<[string, string], Result>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];

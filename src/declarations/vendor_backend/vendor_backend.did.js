export const idlFactory = ({ IDL }) => {
  const Result = IDL.Variant({ 'ok' : IDL.Text, 'err' : IDL.Text });
  const Retailer = IDL.Record({
    'id' : IDL.Nat,
    'retailer_profile_id' : IDL.Opt(IDL.Nat),
    'updated_at' : IDL.Int,
    'contact' : IDL.Text,
    'country' : IDL.Text,
    'address_line1' : IDL.Text,
    'address_line2' : IDL.Opt(IDL.Text),
    'contact_person' : IDL.Opt(IDL.Text),
    'city' : IDL.Text,
    'name' : IDL.Text,
    'distance_from_warehouse' : IDL.Float64,
    'created_at' : IDL.Int,
    'email' : IDL.Opt(IDL.Text),
    'state' : IDL.Text,
    'gstin' : IDL.Text,
    'is_active' : IDL.Bool,
    'pincode' : IDL.Text,
    'company_id' : IDL.Nat,
  });
  const Result_24 = IDL.Variant({ 'ok' : Retailer, 'err' : IDL.Text });
  const Shipment = IDL.Record({
    'id' : IDL.Nat,
    'status' : IDL.Text,
    'shipment_date' : IDL.Int,
    'order_id' : IDL.Nat,
    'employee_id' : IDL.Opt(IDL.Nat),
  });
  const Result_1 = IDL.Variant({ 'ok' : Shipment, 'err' : IDL.Text });
  const Category = IDL.Record({
    'id' : IDL.Nat,
    'name' : IDL.Text,
    'company_id' : IDL.Nat,
  });
  const Result_6 = IDL.Variant({ 'ok' : Category, 'err' : IDL.Text });
  const Company = IDL.Record({
    'id' : IDL.Nat,
    'is_public' : IDL.Bool,
    'owner' : IDL.Principal,
    'city' : IDL.Text,
    'name' : IDL.Text,
    'description' : IDL.Opt(IDL.Text),
    'created_at' : IDL.Int,
    'email' : IDL.Opt(IDL.Text),
    'state' : IDL.Text,
    'gstin' : IDL.Text,
    'address' : IDL.Text,
    'phone' : IDL.Opt(IDL.Text),
    'pincode' : IDL.Text,
  });
  const Result_5 = IDL.Variant({ 'ok' : Company, 'err' : IDL.Text });
  const Employee = IDL.Record({
    'id' : IDL.Nat,
    'contact' : IDL.Text,
    'retailer_id' : IDL.Opt(IDL.Nat),
    'user' : IDL.Principal,
    'truck_id' : IDL.Opt(IDL.Nat),
    'company_id' : IDL.Nat,
  });
  const Result_23 = IDL.Variant({ 'ok' : Employee, 'err' : IDL.Text });
  const InvoiceItem = IDL.Record({
    'id' : IDL.Nat,
    'gst_rate' : IDL.Float64,
    'invoice_id' : IDL.Nat,
    'product_id' : IDL.Nat,
    'taxable_value' : IDL.Float64,
    'cgst' : IDL.Float64,
    'igst' : IDL.Float64,
    'sgst' : IDL.Float64,
    'quantity' : IDL.Nat,
    'price' : IDL.Float64,
    'hsn_code' : IDL.Text,
  });
  const Invoice = IDL.Record({
    'id' : IDL.Nat,
    'irn' : IDL.Text,
    'invoice_number' : IDL.Text,
    'payment_mode' : IDL.Text,
    'retailer_id' : IDL.Nat,
    'grand_total' : IDL.Float64,
    'invoice_date' : IDL.Int,
    'total_cgst' : IDL.Float64,
    'total_taxable_value' : IDL.Float64,
    'total_igst' : IDL.Float64,
    'payment_status' : IDL.Text,
    'total_sgst' : IDL.Float64,
    'due_date' : IDL.Opt(IDL.Int),
    'is_einvoice_generated' : IDL.Bool,
    'items' : IDL.Vec(InvoiceItem),
    'company_id' : IDL.Nat,
  });
  const Result_22 = IDL.Variant({ 'ok' : Invoice, 'err' : IDL.Text });
  const OrderItem = IDL.Record({
    'id' : IDL.Nat,
    'product_id' : IDL.Nat,
    'quantity' : IDL.Nat,
    'order_id' : IDL.Nat,
  });
  const Order = IDL.Record({
    'id' : IDL.Nat,
    'status' : IDL.Text,
    'retailer_id' : IDL.Nat,
    'order_date' : IDL.Int,
    'items' : IDL.Vec(OrderItem),
  });
  const Result_4 = IDL.Variant({ 'ok' : Order, 'err' : IDL.Text });
  const Product = IDL.Record({
    'id' : IDL.Nat,
    'uqc' : IDL.Text,
    'status' : IDL.Text,
    'name' : IDL.Text,
    'total_required_quantity' : IDL.Nat,
    'created_by' : IDL.Opt(IDL.Principal),
    'igst_rate' : IDL.Float64,
    'total_shipped' : IDL.Nat,
    'cgst_rate' : IDL.Float64,
    'price' : IDL.Float64,
    'cess_rate' : IDL.Float64,
    'company_id' : IDL.Nat,
    'available_quantity' : IDL.Nat,
    'sgst_rate' : IDL.Float64,
    'hsn_code' : IDL.Text,
    'category_id' : IDL.Opt(IDL.Nat),
  });
  const Result_3 = IDL.Variant({ 'ok' : Product, 'err' : IDL.Text });
  const RetailerProfile = IDL.Record({
    'id' : IDL.Nat,
    'updated_at' : IDL.Int,
    'country' : IDL.Text,
    'address_line1' : IDL.Text,
    'address_line2' : IDL.Opt(IDL.Text),
    'contact_person' : IDL.Text,
    'city' : IDL.Text,
    'user' : IDL.Principal,
    'business_name' : IDL.Text,
    'business_type' : IDL.Opt(IDL.Text),
    'created_at' : IDL.Int,
    'email' : IDL.Text,
    'state' : IDL.Text,
    'is_verified' : IDL.Bool,
    'gstin' : IDL.Opt(IDL.Text),
    'phone' : IDL.Text,
    'pincode' : IDL.Text,
    'established_year' : IDL.Opt(IDL.Nat),
  });
  const Result_2 = IDL.Variant({ 'ok' : RetailerProfile, 'err' : IDL.Text });
  const Truck = IDL.Record({
    'id' : IDL.Nat,
    'license_plate' : IDL.Text,
    'is_available' : IDL.Bool,
    'capacity' : IDL.Nat,
    'company_id' : IDL.Nat,
  });
  const Result_21 = IDL.Variant({ 'ok' : Truck, 'err' : IDL.Text });
  const Result_20 = IDL.Variant({ 'ok' : IDL.Vec(Category), 'err' : IDL.Text });
  const Result_19 = IDL.Variant({ 'ok' : IDL.Vec(Company), 'err' : IDL.Text });
  const CompanyRetailerConnection = IDL.Record({
    'id' : IDL.Nat,
    'connected_at' : IDL.Int,
    'status' : IDL.Text,
    'retailer_id' : IDL.Nat,
    'approved_at' : IDL.Opt(IDL.Int),
    'approved_by' : IDL.Opt(IDL.Principal),
    'company_id' : IDL.Nat,
    'credit_limit' : IDL.Float64,
    'payment_terms' : IDL.Text,
  });
  const Result_18 = IDL.Variant({
    'ok' : IDL.Vec(CompanyRetailerConnection),
    'err' : IDL.Text,
  });
  const Result_17 = IDL.Variant({
    'ok' : IDL.Record({
      'orders_placed' : IDL.Nat,
      'retailers_available' : IDL.Nat,
      'pending_orders' : IDL.Nat,
      'employees_available' : IDL.Nat,
    }),
    'err' : IDL.Text,
  });
  const Result_9 = IDL.Variant({ 'ok' : IDL.Vec(Shipment), 'err' : IDL.Text });
  const Result_16 = IDL.Variant({ 'ok' : IDL.Vec(Employee), 'err' : IDL.Text });
  const Result_15 = IDL.Variant({ 'ok' : IDL.Nat, 'err' : IDL.Text });
  const Result_14 = IDL.Variant({ 'ok' : IDL.Vec(Invoice), 'err' : IDL.Text });
  const User = IDL.Record({
    'id' : IDL.Principal,
    'password_hash' : IDL.Text,
    'groups' : IDL.Vec(IDL.Text),
    'username' : IDL.Text,
    'created_at' : IDL.Int,
    'email' : IDL.Text,
    'is_staff' : IDL.Bool,
  });
  const Result_7 = IDL.Variant({ 'ok' : User, 'err' : IDL.Text });
  const Result_13 = IDL.Variant({ 'ok' : IDL.Vec(Order), 'err' : IDL.Text });
  const Result_12 = IDL.Variant({ 'ok' : IDL.Vec(Product), 'err' : IDL.Text });
  const Result_11 = IDL.Variant({
    'ok' : IDL.Record({
      'connected_companies' : IDL.Nat,
      'pending_requests' : IDL.Nat,
      'total_orders' : IDL.Nat,
    }),
    'err' : IDL.Text,
  });
  const Result_10 = IDL.Variant({ 'ok' : IDL.Vec(Retailer), 'err' : IDL.Text });
  const Result_8 = IDL.Variant({ 'ok' : IDL.Vec(Truck), 'err' : IDL.Text });
  return IDL.Service({
    'acceptRetailerRequest' : IDL.Func(
        [IDL.Nat, IDL.Text, IDL.Float64, IDL.Text],
        [Result],
        [],
      ),
    'addRetailer' : IDL.Func(
        [
          IDL.Nat,
          IDL.Text,
          IDL.Opt(IDL.Text),
          IDL.Opt(IDL.Text),
          IDL.Text,
          IDL.Text,
          IDL.Opt(IDL.Text),
          IDL.Text,
          IDL.Text,
          IDL.Text,
          IDL.Text,
          IDL.Text,
          IDL.Float64,
        ],
        [Result_24],
        [],
      ),
    'allocateOrder' : IDL.Func([IDL.Nat, IDL.Nat], [Result], []),
    'approveOrder' : IDL.Func([IDL.Nat], [Result_1], []),
    'createCategory' : IDL.Func([IDL.Nat, IDL.Text], [Result_6], []),
    'createCompany' : IDL.Func(
        [
          IDL.Text,
          IDL.Text,
          IDL.Text,
          IDL.Text,
          IDL.Text,
          IDL.Text,
          IDL.Opt(IDL.Text),
          IDL.Opt(IDL.Text),
          IDL.Bool,
          IDL.Opt(IDL.Text),
        ],
        [Result_5],
        [],
      ),
    'createEmployee' : IDL.Func(
        [IDL.Nat, IDL.Opt(IDL.Nat), IDL.Text, IDL.Opt(IDL.Nat)],
        [Result_23],
        [],
      ),
    'createInvoice' : IDL.Func(
        [
          IDL.Text,
          IDL.Nat,
          IDL.Nat,
          IDL.Int,
          IDL.Opt(IDL.Int),
          IDL.Text,
          IDL.Vec(
            IDL.Tuple(
              IDL.Nat,
              IDL.Nat,
              IDL.Float64,
              IDL.Float64,
              IDL.Float64,
              IDL.Float64,
              IDL.Float64,
              IDL.Float64,
              IDL.Text,
            )
          ),
        ],
        [Result_22],
        [],
      ),
    'createOrder' : IDL.Func(
        [IDL.Nat, IDL.Vec(IDL.Tuple(IDL.Nat, IDL.Nat))],
        [Result_4],
        [],
      ),
    'createProduct' : IDL.Func(
        [
          IDL.Nat,
          IDL.Text,
          IDL.Opt(IDL.Nat),
          IDL.Nat,
          IDL.Text,
          IDL.Float64,
          IDL.Text,
          IDL.Float64,
          IDL.Float64,
          IDL.Float64,
          IDL.Float64,
        ],
        [Result_3],
        [],
      ),
    'createRetailerProfile' : IDL.Func(
        [
          IDL.Text,
          IDL.Text,
          IDL.Text,
          IDL.Text,
          IDL.Text,
          IDL.Opt(IDL.Text),
          IDL.Text,
          IDL.Text,
          IDL.Text,
          IDL.Text,
          IDL.Opt(IDL.Text),
          IDL.Opt(IDL.Text),
          IDL.Opt(IDL.Nat),
        ],
        [Result_2],
        [],
      ),
    'createTruck' : IDL.Func([IDL.Nat, IDL.Text, IDL.Nat], [Result_21], []),
    'deleteCategory' : IDL.Func([IDL.Nat], [Result], []),
    'deleteCompany' : IDL.Func([IDL.Nat], [Result], []),
    'deleteProduct' : IDL.Func([IDL.Nat], [Result], []),
    'forgotPassword' : IDL.Func([IDL.Text, IDL.Text], [Result], []),
    'getCategories' : IDL.Func([IDL.Opt(IDL.Nat)], [Result_20], []),
    'getCategoryStockData' : IDL.Func(
        [],
        [IDL.Vec(IDL.Record({ 'value' : IDL.Nat, 'name' : IDL.Text }))],
        [],
      ),
    'getCompanies' : IDL.Func([], [Result_19], []),
    'getCompanyConnections' : IDL.Func([IDL.Nat, IDL.Text], [Result_18], []),
    'getCounts' : IDL.Func([IDL.Nat], [Result_17], []),
    'getEmployeeShipments' : IDL.Func([], [Result_9], []),
    'getEmployees' : IDL.Func([IDL.Opt(IDL.Nat)], [Result_16], []),
    'getInvoiceCount' : IDL.Func([IDL.Nat], [Result_15], []),
    'getInvoices' : IDL.Func([IDL.Opt(IDL.Nat)], [Result_14], []),
    'getLoggedInUser' : IDL.Func([], [Result_7], []),
    'getOrders' : IDL.Func([IDL.Opt(IDL.Text)], [Result_13], []),
    'getOrdersByRetailer' : IDL.Func([IDL.Nat], [Result_13], []),
    'getProducts' : IDL.Func([IDL.Opt(IDL.Nat)], [Result_12], []),
    'getPublicCompanies' : IDL.Func([], [IDL.Vec(Company)], []),
    'getRetailerCounts' : IDL.Func([], [Result_11], []),
    'getRetailerProfile' : IDL.Func([], [Result_2], []),
    'getRetailers' : IDL.Func([IDL.Opt(IDL.Nat)], [Result_10], []),
    'getShipments' : IDL.Func([], [Result_9], []),
    'getTrucks' : IDL.Func([IDL.Opt(IDL.Nat)], [Result_8], []),
    'health' : IDL.Func([], [IDL.Text], []),
    'login' : IDL.Func([IDL.Text, IDL.Text], [Result], []),
    'logout' : IDL.Func([], [Result], []),
    'register' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Text, IDL.Vec(IDL.Text)],
        [Result_7],
        [],
      ),
    'requestCompanyApproval' : IDL.Func([IDL.Nat, IDL.Text], [Result], []),
    'resetPassword' : IDL.Func([IDL.Text, IDL.Text, IDL.Text], [Result], []),
    'storeQRCode' : IDL.Func([IDL.Text], [Result], []),
    'updateCategory' : IDL.Func([IDL.Nat, IDL.Text], [Result_6], []),
    'updateCompany' : IDL.Func(
        [
          IDL.Nat,
          IDL.Text,
          IDL.Text,
          IDL.Text,
          IDL.Text,
          IDL.Text,
          IDL.Text,
          IDL.Opt(IDL.Text),
          IDL.Opt(IDL.Text),
          IDL.Bool,
          IDL.Opt(IDL.Text),
        ],
        [Result_5],
        [],
      ),
    'updateOrderStatus' : IDL.Func([IDL.Nat, IDL.Text], [Result_4], []),
    'updateProductQuantity' : IDL.Func(
        [IDL.Nat, IDL.Nat, IDL.Nat, IDL.Nat],
        [Result_3],
        [],
      ),
    'updateRetailerProfile' : IDL.Func(
        [
          IDL.Text,
          IDL.Text,
          IDL.Text,
          IDL.Text,
          IDL.Text,
          IDL.Opt(IDL.Text),
          IDL.Text,
          IDL.Text,
          IDL.Text,
          IDL.Text,
          IDL.Opt(IDL.Text),
          IDL.Opt(IDL.Text),
          IDL.Opt(IDL.Nat),
        ],
        [Result_2],
        [],
      ),
    'updateShipmentStatus' : IDL.Func([IDL.Nat, IDL.Text], [Result_1], []),
    'verifyOTP' : IDL.Func([IDL.Text, IDL.Text], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };

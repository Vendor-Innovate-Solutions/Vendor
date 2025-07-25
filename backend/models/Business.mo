import Array "mo:base/Array";
import Time "mo:base/Time";
import Principal "mo:base/Principal";

module {
  public type InvoiceItem = {
    id : Nat;
    invoice_id : Nat;
    product_id : Nat;
    quantity : Nat;
    price : Float;
    taxable_value : Float;
    gst_rate : Float;
    cgst : Float;
    sgst : Float;
    igst : Float;
    hsn_code : Text;
  };

  public type Invoice = {
    id : Nat;
    invoice_number : Text;
    company_id : Nat;
    retailer_id : Nat;
    invoice_date : Int;
    due_date : ?Int;
    is_einvoice_generated : Bool;
    irn : Text;
    total_taxable_value : Float;
    total_cgst : Float;
    total_sgst : Float;
    total_igst : Float;
    grand_total : Float;
    payment_mode : Text; // "cash", "upi", "card", "bank"
    payment_status : Text; // "paid", "unpaid", "partial"
    items : [InvoiceItem];
  };

  public type CompanyRetailerConnection = {
    id : Nat;
    company_id : Nat;
    retailer_id : Nat;
    status : Text; // "pending", "approved", "rejected", "suspended"
    connected_at : Int;
    approved_at : ?Int;
    approved_by : ?Principal;
    credit_limit : Float;
    payment_terms : Text;
  };

  public type CompanyInvite = {
    id : Nat;
    company_id : Nat;
    invited_by : Principal;
    invite_code : Text;
    email : Text;
    message : Text;
    is_used : Bool;
    used_by : ?Nat; // retailer_profile_id
    created_at : Int;
    expires_at : Int;
    used_at : ?Int;
  };

  public type RetailerRequest = {
    id : Nat;
    retailer_id : Nat;
    company_id : Nat;
    message : Text;
    status : Text; // "pending", "approved", "rejected"
    requested_at : Int;
    reviewed_at : ?Int;
    reviewed_by : ?Principal;
  };

  public type User = {
    id : Principal;
    username : Text;
    email : Text;
    password_hash : Text;
    is_staff : Bool;
    groups : [Text];
    created_at : Int;
  };

  public type PasswordResetOTP = {
    id : Nat;
    user : Principal;
    otp : Text;
    is_verified : Bool;
    created_at : Int;
    expires_at : Int;
  };

  public type BusinessStore = {
    invoices : [Invoice];
    invoice_items : [InvoiceItem];
    connections : [CompanyRetailerConnection];
    invites : [CompanyInvite];
    requests : [RetailerRequest];
    users : [User];
    otps : [PasswordResetOTP];
    nextInvoiceId : Nat;
    nextItemId : Nat;
    nextConnectionId : Nat;
    nextInviteId : Nat;
    nextRequestId : Nat;
    nextOtpId : Nat;
  };

  public func emptyStore() : BusinessStore {
    {
      invoices = [];
      invoice_items = [];
      connections = [];
      invites = [];
      requests = [];
      users = [];
      otps = [];
      nextInvoiceId = 1;
      nextItemId = 1;
      nextConnectionId = 1;
      nextInviteId = 1;
      nextRequestId = 1;
      nextOtpId = 1;
    }
  };

  // User management functions
  public func createUser(store : BusinessStore, id : Principal, username : Text, email : Text, password_hash : Text, is_staff : Bool, groups : [Text]) : (BusinessStore, User) {
    let user = {
      id = id;
      username = username;
      email = email;
      password_hash = password_hash;
      is_staff = is_staff;
      groups = groups;
      created_at = Time.now();
    };
    let newStore = {
      invoices = store.invoices;
      invoice_items = store.invoice_items;
      connections = store.connections;
      invites = store.invites;
      requests = store.requests;
      users = Array.append(store.users, [user]);
      otps = store.otps;
      nextInvoiceId = store.nextInvoiceId;
      nextItemId = store.nextItemId;
      nextConnectionId = store.nextConnectionId;
      nextInviteId = store.nextInviteId;
      nextRequestId = store.nextRequestId;
      nextOtpId = store.nextOtpId;
    };
    (newStore, user)
  };

  public func getUserById(store : BusinessStore, id : Principal) : ?User {
    Array.find<User>(store.users, func(u) { u.id == id })
  };

  public func getUserByUsername(store : BusinessStore, username : Text) : ?User {
    Array.find<User>(store.users, func(u) { u.username == username })
  };

  public func getAllUsers(store : BusinessStore) : [User] {
    store.users
  };

  // Invoice functions
  public func createInvoice(
    store : BusinessStore,
    invoice_number : Text,
    company_id : Nat,
    retailer_id : Nat,
    invoice_date : Int,
    due_date : ?Int,
    payment_mode : Text,
    items_data : [(Nat, Nat, Float, Float, Float, Float, Float, Float, Text)] // (product_id, quantity, price, taxable_value, gst_rate, cgst, sgst, igst, hsn_code)
  ) : (BusinessStore, Invoice) {
    let invoice_id = store.nextInvoiceId;
    var nextItemId = store.nextItemId;
    
    let items = Array.map<(Nat, Nat, Float, Float, Float, Float, Float, Float, Text), InvoiceItem>(items_data, func((product_id, quantity, price, taxable_value, gst_rate, cgst, sgst, igst, hsn_code)) {
      let item = {
        id = nextItemId;
        invoice_id = invoice_id;
        product_id = product_id;
        quantity = quantity;
        price = price;
        taxable_value = taxable_value;
        gst_rate = gst_rate;
        cgst = cgst;
        sgst = sgst;
        igst = igst;
        hsn_code = hsn_code;
      };
      nextItemId += 1;
      item
    });

    // Calculate totals
    var total_taxable_value : Float = 0;
    var total_cgst : Float = 0;
    var total_sgst : Float = 0;
    var total_igst : Float = 0;

    for (item in items.vals()) {
      total_taxable_value += item.taxable_value;
      total_cgst += item.cgst;
      total_sgst += item.sgst;
      total_igst += item.igst;
    };

    let grand_total = total_taxable_value + total_cgst + total_sgst + total_igst;

    let invoice = {
      id = invoice_id;
      invoice_number = invoice_number;
      company_id = company_id;
      retailer_id = retailer_id;
      invoice_date = invoice_date;
      due_date = due_date;
      is_einvoice_generated = false;
      irn = "";
      total_taxable_value = total_taxable_value;
      total_cgst = total_cgst;
      total_sgst = total_sgst;
      total_igst = total_igst;
      grand_total = grand_total;
      payment_mode = payment_mode;
      payment_status = "unpaid";
      items = items;
    };

    let newStore = {
      invoices = Array.append(store.invoices, [invoice]);
      invoice_items = Array.append(store.invoice_items, items);
      connections = store.connections;
      invites = store.invites;
      requests = store.requests;
      users = store.users;
      otps = store.otps;
      nextInvoiceId = store.nextInvoiceId + 1;
      nextItemId = nextItemId;
      nextConnectionId = store.nextConnectionId;
      nextInviteId = store.nextInviteId;
      nextRequestId = store.nextRequestId;
      nextOtpId = store.nextOtpId;
    };
    
    (newStore, invoice)
  };

  public func getInvoiceById(store : BusinessStore, id : Nat) : ?Invoice {
    let invoiceOpt = Array.find<Invoice>(store.invoices, func(i) { i.id == id });
    switch (invoiceOpt) {
      case null { null };
      case (?invoice) {
        let items = Array.filter<InvoiceItem>(store.invoice_items, func(item) { item.invoice_id == id });
        ?{
          id = invoice.id;
          invoice_number = invoice.invoice_number;
          company_id = invoice.company_id;
          retailer_id = invoice.retailer_id;
          invoice_date = invoice.invoice_date;
          due_date = invoice.due_date;
          is_einvoice_generated = invoice.is_einvoice_generated;
          irn = invoice.irn;
          total_taxable_value = invoice.total_taxable_value;
          total_cgst = invoice.total_cgst;
          total_sgst = invoice.total_sgst;
          total_igst = invoice.total_igst;
          grand_total = invoice.grand_total;
          payment_mode = invoice.payment_mode;
          payment_status = invoice.payment_status;
          items = items;
        }
      };
    }
  };

  public func getInvoicesByCompany(store : BusinessStore, company_id : Nat) : [Invoice] {
    let companyInvoices = Array.filter<Invoice>(store.invoices, func(i) { i.company_id == company_id });
    Array.map<Invoice, Invoice>(companyInvoices, func(invoice) {
      let items = Array.filter<InvoiceItem>(store.invoice_items, func(item) { item.invoice_id == invoice.id });
      {
        id = invoice.id;
        invoice_number = invoice.invoice_number;
        company_id = invoice.company_id;
        retailer_id = invoice.retailer_id;
        invoice_date = invoice.invoice_date;
        due_date = invoice.due_date;
        is_einvoice_generated = invoice.is_einvoice_generated;
        irn = invoice.irn;
        total_taxable_value = invoice.total_taxable_value;
        total_cgst = invoice.total_cgst;
        total_sgst = invoice.total_sgst;
        total_igst = invoice.total_igst;
        grand_total = invoice.grand_total;
        payment_mode = invoice.payment_mode;
        payment_status = invoice.payment_status;
        items = items;
      }
    })
  };

  // Connection functions
  public func createConnection(store : BusinessStore, company_id : Nat, retailer_id : Nat, approved_by : ?Principal, credit_limit : Float, payment_terms : Text) : (BusinessStore, CompanyRetailerConnection) {
    let now = Time.now();
    let connection = {
      id = store.nextConnectionId;
      company_id = company_id;
      retailer_id = retailer_id;
      status = "approved";
      connected_at = now;
      approved_at = ?now;
      approved_by = approved_by;
      credit_limit = credit_limit;
      payment_terms = payment_terms;
    };
    let newStore = {
      invoices = store.invoices;
      invoice_items = store.invoice_items;
      connections = Array.append(store.connections, [connection]);
      invites = store.invites;
      requests = store.requests;
      users = store.users;
      otps = store.otps;
      nextInvoiceId = store.nextInvoiceId;
      nextItemId = store.nextItemId;
      nextConnectionId = store.nextConnectionId + 1;
      nextInviteId = store.nextInviteId;
      nextRequestId = store.nextRequestId;
      nextOtpId = store.nextOtpId;
    };
    (newStore, connection)
  };

  public func getConnectionsByCompany(store : BusinessStore, company_id : Nat) : [CompanyRetailerConnection] {
    Array.filter<CompanyRetailerConnection>(store.connections, func(c) { c.company_id == company_id })
  };

  public func getConnectionsByRetailer(store : BusinessStore, retailer_id : Nat) : [CompanyRetailerConnection] {
    Array.filter<CompanyRetailerConnection>(store.connections, func(c) { c.retailer_id == retailer_id })
  };

  public func updateConnectionStatus(store : BusinessStore, id : Nat, status : Text) : (BusinessStore, ?CompanyRetailerConnection) {
    var index : ?Nat = null;
    var i : Nat = 0;
    for (c in store.connections.vals()) {
      if (c.id == id) {
        index := ?i;
      };
      i += 1;
    };
    
    switch (index) {
      case null { (store, null) };
      case (?i) {
        let oldConnection = store.connections[i];
        let updatedConnection = {
          id = oldConnection.id;
          company_id = oldConnection.company_id;
          retailer_id = oldConnection.retailer_id;
          status = status;
          connected_at = oldConnection.connected_at;
          approved_at = oldConnection.approved_at;
          approved_by = oldConnection.approved_by;
          credit_limit = oldConnection.credit_limit;
          payment_terms = oldConnection.payment_terms;
        };
        let newConnections = Array.tabulate<CompanyRetailerConnection>(store.connections.size(), func(j) {
          if (j == i) updatedConnection else store.connections[j]
        });
        let newStore = {
          invoices = store.invoices;
          invoice_items = store.invoice_items;
          connections = newConnections;
          invites = store.invites;
          requests = store.requests;
          users = store.users;
          otps = store.otps;
          nextInvoiceId = store.nextInvoiceId;
          nextItemId = store.nextItemId;
          nextConnectionId = store.nextConnectionId;
          nextInviteId = store.nextInviteId;
          nextRequestId = store.nextRequestId;
          nextOtpId = store.nextOtpId;
        };
        (newStore, ?updatedConnection)
      };
    }
  };

  // Additional utility functions
  public func getAllInvoices(store : BusinessStore) : [Invoice] {
    Array.map<Invoice, Invoice>(store.invoices, func(invoice) {
      let items = Array.filter<InvoiceItem>(store.invoice_items, func(item) { item.invoice_id == invoice.id });
      {
        id = invoice.id;
        invoice_number = invoice.invoice_number;
        company_id = invoice.company_id;
        retailer_id = invoice.retailer_id;
        invoice_date = invoice.invoice_date;
        due_date = invoice.due_date;
        is_einvoice_generated = invoice.is_einvoice_generated;
        irn = invoice.irn;
        total_taxable_value = invoice.total_taxable_value;
        total_cgst = invoice.total_cgst;
        total_sgst = invoice.total_sgst;
        total_igst = invoice.total_igst;
        grand_total = invoice.grand_total;
        payment_mode = invoice.payment_mode;
        payment_status = invoice.payment_status;
        items = items;
      }
    })
  };

  public func getAllConnections(store : BusinessStore) : [CompanyRetailerConnection] {
    store.connections
  };
}

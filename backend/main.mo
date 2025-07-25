import Debug "mo:base/Debug";
import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Text "mo:base/Text";
import Array "mo:base/Array";
import Option "mo:base/Option";
import Result "mo:base/Result";

// Import all models
import Company "./models/Company";
import Category "./models/Category";
import Product "./models/Product";
import Retailer "./models/Retailer";
import RetailerProfile "./models/RetailerProfile";
import Order "./models/Order";
import Operations "./models/Operations";
import Business "./models/Business";

// Import utilities
import Auth "./utils/auth";
import Email "./utils/email";
import Allocation "./utils/allocation";
import Odoo "./utils/odoo";

actor VendorBackend {
  type Result<T, E> = Result.Result<T, E>;

  // Stable storage for all models
  private stable var companyStore : Company.CompanyStore = Company.emptyStore();
  private stable var categoryStore : Category.CategoryStore = Category.emptyStore();
  private stable var productStore : Product.ProductStore = Product.emptyStore();
  private stable var retailerStore : Retailer.RetailerStore = Retailer.emptyStore();
  private stable var retailerProfileStore : RetailerProfile.RetailerProfileStore = RetailerProfile.emptyStore();
  private stable var orderStore : Order.OrderStore = Order.emptyStore();
  private stable var operationsStore : Operations.OperationsStore = Operations.emptyStore();
  private stable var businessStore : Business.BusinessStore = Business.emptyStore();
  private stable var authSessions : [Auth.AuthSession] = [];

  // ================================
  // AUTHENTICATION & USER MANAGEMENT
  // ================================

  public shared(msg) func register(username : Text, email : Text, password : Text, groups : [Text]) : async Result<Business.User, Text> {
    let caller = msg.caller;
    
    // Check if user already exists
    switch (Business.getUserByUsername(businessStore, username)) {
      case (?existingUser) { #err("Username already exists") };
      case null {
        if (not Auth.validatePassword(password)) {
          return #err("Password must be at least 6 characters");
        };
        
        let passwordHash = Auth.hashPassword(password);
        let (newBusinessStore, user) = Business.createUser(businessStore, caller, username, email, passwordHash, false, groups);
        businessStore := newBusinessStore;
        let (newAuthSessions, session) = Auth.createSession(authSessions, caller, groups);
        authSessions := newAuthSessions;
        #ok(user)
      };
    }
  };

  public shared(msg) func login(username : Text, password : Text) : async Result<Text, Text> {
    let caller = msg.caller;
    
    switch (Business.getUserByUsername(businessStore, username)) {
      case null { #err("User not found") };
      case (?user) {
        let passwordHash = Auth.hashPassword(password);
        if (user.password_hash == passwordHash) {
          let (newAuthSessions, session) = Auth.createSession(authSessions, caller, user.groups);
          authSessions := newAuthSessions;
          #ok("Login successful")
        } else {
          #err("Invalid password")
        }
      };
    }
  };

  public shared(msg) func logout() : async Result<Text, Text> {
    let caller = msg.caller;
    let (newAuthSessions, removed) = Auth.removeSession(authSessions, caller);
    authSessions := newAuthSessions;
    if (removed) {
      #ok("Logged out successfully")
    } else {
      #err("No active session found")
    }
  };

  public shared(msg) func getLoggedInUser() : async Result<Business.User, Text> {
    let caller = msg.caller;
    if (not Auth.isAuthenticated(caller)) {
      return #err("Not authenticated");
    };
    
    switch (Business.getUserById(businessStore, caller)) {
      case null { #err("User not found") };
      case (?user) { #ok(user) };
    }
  };

  // ================================
  // COMPANY MANAGEMENT
  // ================================

  public shared(msg) func createCompany(
    name : Text, 
    gstin : Text, 
    address : Text, 
    state : Text, 
    city : Text, 
    pincode : Text, 
    phone : ?Text, 
    email : ?Text, 
    is_public : Bool, 
    description : ?Text
  ) : async Result<Company.Company, Text> {
    let caller = msg.caller;
    if (not Auth.isAuthenticated(caller)) {
      return #err("Not authenticated");
    };

    let (newCompanyStore, company) = Company.create(companyStore, name, gstin, address, state, city, pincode, phone, email, is_public, description, caller);
    companyStore := newCompanyStore;
    #ok(company)
  };

  public shared(msg) func getCompanies() : async Result<[Company.Company], Text> {
    let caller = msg.caller;
    if (not Auth.isAuthenticated(caller)) {
      return #err("Not authenticated");
    };

    let companies = Company.getByOwner(companyStore, caller);
    #ok(companies)
  };

  public shared(msg) func getPublicCompanies() : async [Company.Company] {
    Company.getPublic(companyStore)
  };

  public shared(msg) func updateCompany(
    id : Nat,
    name : Text, 
    gstin : Text, 
    address : Text, 
    state : Text, 
    city : Text, 
    pincode : Text, 
    phone : ?Text, 
    email : ?Text, 
    is_public : Bool, 
    description : ?Text
  ) : async Result<Company.Company, Text> {
    let caller = msg.caller;
    if (not Auth.isAuthenticated(caller)) {
      return #err("Not authenticated");
    };

    let (newCompanyStore, result) = Company.update(companyStore, id, name, gstin, address, state, city, pincode, phone, email, is_public, description);
    companyStore := newCompanyStore;
    switch (result) {
      case null { #err("Company not found") };
      case (?company) { #ok(company) };
    }
  };

  public shared(msg) func deleteCompany(id : Nat) : async Result<Text, Text> {
    let caller = msg.caller;
    if (not Auth.isAuthenticated(caller)) {
      return #err("Not authenticated");
    };

    let (newCompanyStore, deleted) = Company.delete(companyStore, id);
    companyStore := newCompanyStore;
    if (deleted) {
      #ok("Company deleted successfully")
    } else {
      #err("Company not found")
    }
  };

  // ================================
  // CATEGORY MANAGEMENT
  // ================================

  public shared(msg) func createCategory(company_id : Nat, name : Text) : async Result<Category.Category, Text> {
    let caller = msg.caller;
    if (not Auth.isAuthenticated(caller)) {
      return #err("Not authenticated");
    };

    let (newCategoryStore, category) = Category.create(categoryStore, company_id, name);
    categoryStore := newCategoryStore;
    #ok(category)
  };

  public shared(msg) func getCategories(company_id : ?Nat) : async Result<[Category.Category], Text> {
    let caller = msg.caller;
    if (not Auth.isAuthenticated(caller)) {
      return #err("Not authenticated");
    };

    let categories = switch (company_id) {
      case null { Category.getAll(categoryStore) };
      case (?id) { Category.getByCompany(categoryStore, id) };
    };
    #ok(categories)
  };

  public shared(msg) func updateCategory(id : Nat, name : Text) : async Result<Category.Category, Text> {
    let caller = msg.caller;
    if (not Auth.isAuthenticated(caller)) {
      return #err("Not authenticated");
    };

    let (newCategoryStore, result) = Category.update(categoryStore, id, name);
    categoryStore := newCategoryStore;
    switch (result) {
      case null { #err("Category not found") };
      case (?category) { #ok(category) };
    }
  };

  public shared(msg) func deleteCategory(id : Nat) : async Result<Text, Text> {
    let caller = msg.caller;
    if (not Auth.isAuthenticated(caller)) {
      return #err("Not authenticated");
    };

    let (newCategoryStore, deleted) = Category.delete(categoryStore, id);
    categoryStore := newCategoryStore;
    if (deleted) {
      #ok("Category deleted successfully")
    } else {
      #err("Category not found")
    }
  };

  // ================================
  // PRODUCT MANAGEMENT
  // ================================

  public shared(msg) func createProduct(
    company_id : Nat,
    name : Text,
    category_id : ?Nat,
    available_quantity : Nat,
    uqc : Text,
    price : Float,
    hsn_code : Text,
    cgst_rate : Float,
    sgst_rate : Float,
    igst_rate : Float,
    cess_rate : Float
  ) : async Result<Product.Product, Text> {
    let caller = msg.caller;
    if (not Auth.isAuthenticated(caller)) {
      return #err("Not authenticated");
    };

    let (newProductStore, product) = Product.create(productStore, company_id, name, category_id, available_quantity, uqc, price, hsn_code, cgst_rate, sgst_rate, igst_rate, cess_rate, ?caller);
    productStore := newProductStore;
    #ok(product)
  };

  public shared(msg) func getProducts(company_id : ?Nat) : async Result<[Product.Product], Text> {
    let caller = msg.caller;
    if (not Auth.isAuthenticated(caller)) {
      return #err("Not authenticated");
    };

    let products = switch (company_id) {
      case null { Product.getAll(productStore) };
      case (?id) { Product.getByCompany(productStore, id) };
    };
    #ok(products)
  };

  public shared(msg) func updateProductQuantity(id : Nat, available_quantity : Nat, total_shipped : Nat, total_required_quantity : Nat) : async Result<Product.Product, Text> {
    let caller = msg.caller;
    if (not Auth.isAuthenticated(caller)) {
      return #err("Not authenticated");
    };

    let (newProductStore, result) = Product.updateQuantity(productStore, id, available_quantity, total_shipped, total_required_quantity);
    productStore := newProductStore;
    switch (result) {
      case null { #err("Product not found") };
      case (?product) { #ok(product) };
    }
  };

  public shared(msg) func deleteProduct(id : Nat) : async Result<Text, Text> {
    let caller = msg.caller;
    if (not Auth.isAuthenticated(caller)) {
      return #err("Not authenticated");
    };

    let (newProductStore, deleted) = Product.delete(productStore, id);
    productStore := newProductStore;
    if (deleted) {
      #ok("Product deleted successfully")
    } else {
      #err("Product not found")
    }
  };

  // ================================
  // RETAILER MANAGEMENT
  // ================================

  public shared(msg) func createRetailerProfile(
    business_name : Text,
    contact_person : Text,
    phone : Text,
    email : Text,
    address_line1 : Text,
    address_line2 : ?Text,
    city : Text,
    state : Text,
    pincode : Text,
    country : Text,
    gstin : ?Text,
    business_type : ?Text,
    established_year : ?Nat
  ) : async Result<RetailerProfile.RetailerProfile, Text> {
    let caller = msg.caller;
    if (not Auth.isAuthenticated(caller)) {
      return #err("Not authenticated");
    };

    // Check if profile already exists
    switch (RetailerProfile.getByUser(retailerProfileStore, caller)) {
      case (?_existing) { #err("Retailer profile already exists") };
      case null {
        let (newRetailerProfileStore, profile) = RetailerProfile.create(retailerProfileStore, caller, business_name, contact_person, phone, email, address_line1, address_line2, city, state, pincode, country, gstin, business_type, established_year);
        retailerProfileStore := newRetailerProfileStore;
        #ok(profile)
      };
    }
  };

  public shared(msg) func getRetailerProfile() : async Result<RetailerProfile.RetailerProfile, Text> {
    let caller = msg.caller;
    if (not Auth.isAuthenticated(caller)) {
      return #err("Not authenticated");
    };

    switch (RetailerProfile.getByUser(retailerProfileStore, caller)) {
      case null { #err("Retailer profile not found") };
      case (?profile) { #ok(profile) };
    }
  };

  public shared(msg) func updateRetailerProfile(
    business_name : Text,
    contact_person : Text,
    phone : Text,
    email : Text,
    address_line1 : Text,
    address_line2 : ?Text,
    city : Text,
    state : Text,
    pincode : Text,
    country : Text,
    gstin : ?Text,
    business_type : ?Text,
    established_year : ?Nat
  ) : async Result<RetailerProfile.RetailerProfile, Text> {
    let caller = msg.caller;
    if (not Auth.isAuthenticated(caller)) {
      return #err("Not authenticated");
    };

    switch (RetailerProfile.getByUser(retailerProfileStore, caller)) {
      case null { #err("Retailer profile not found") };
      case (?profile) {
        let (newRetailerProfileStore, result) = RetailerProfile.update(retailerProfileStore, profile.id, business_name, contact_person, phone, email, address_line1, address_line2, city, state, pincode, country, gstin, business_type, established_year);
        retailerProfileStore := newRetailerProfileStore;
        switch (result) {
          case null { #err("Failed to update profile") };
          case (?updated) { #ok(updated) };
        }
      };
    }
  };

  public shared(msg) func addRetailer(
    company_id : Nat,
    name : Text,
    contact_person : ?Text,
    email : ?Text,
    contact : Text,
    address_line1 : Text,
    address_line2 : ?Text,
    city : Text,
    state : Text,
    pincode : Text,
    country : Text,
    gstin : Text,
    distance_from_warehouse : Float
  ) : async Result<Retailer.Retailer, Text> {
    let caller = msg.caller;
    if (not Auth.isAuthenticated(caller)) {
      return #err("Not authenticated");
    };

    let (newRetailerStore, retailer) = Retailer.create(retailerStore, company_id, name, contact_person, email, contact, address_line1, address_line2, city, state, pincode, country, gstin, distance_from_warehouse, null);
    retailerStore := newRetailerStore;
    #ok(retailer)
  };

  public shared(msg) func getRetailers(company_id : ?Nat) : async Result<[Retailer.Retailer], Text> {
    let caller = msg.caller;
    if (not Auth.isAuthenticated(caller)) {
      return #err("Not authenticated");
    };

    let retailers = switch (company_id) {
      case null { Retailer.getAll(retailerStore) };
      case (?id) { Retailer.getByCompany(retailerStore, id) };
    };
    #ok(retailers)
  };

  // ================================
  // ORDER MANAGEMENT
  // ================================

  public shared(msg) func createOrder(retailer_id : Nat, items : [(Nat, Nat)]) : async Result<Order.Order, Text> {
    let caller = msg.caller;
    if (not Auth.isAuthenticated(caller)) {
      return #err("Not authenticated");
    };

    let (newOrderStore, order) = Order.create(orderStore, retailer_id, items);
    orderStore := newOrderStore;
    #ok(order)
  };

  public shared(msg) func getOrders(status : ?Text) : async Result<[Order.Order], Text> {
    let caller = msg.caller;
    if (not Auth.isAuthenticated(caller)) {
      return #err("Not authenticated");
    };

    let orders = switch (status) {
      case null { Order.getAll(orderStore) };
      case (?s) { Order.getByStatus(orderStore, s) };
    };
    #ok(orders)
  };

  public shared(msg) func getOrdersByRetailer(retailer_id : Nat) : async Result<[Order.Order], Text> {
    let caller = msg.caller;
    if (not Auth.isAuthenticated(caller)) {
      return #err("Not authenticated");
    };

    let orders = Order.getByRetailer(orderStore, retailer_id);
    #ok(orders)
  };

  public shared(msg) func updateOrderStatus(order_id : Nat, status : Text) : async Result<Order.Order, Text> {
    let caller = msg.caller;
    if (not Auth.isAuthenticated(caller)) {
      return #err("Not authenticated");
    };

    let (newOrderStore, result) = Order.updateStatus(orderStore, order_id, status);
    orderStore := newOrderStore;
    switch (result) {
      case null { #err("Order not found") };
      case (?order) { #ok(order) };
    }
  };

  public shared(msg) func approveOrder(order_id : Nat) : async Result<Operations.Shipment, Text> {
    let caller = msg.caller;
    if (not Auth.isAuthenticated(caller)) {
      return #err("Not authenticated");
    };

    // Check if order exists
    switch (Order.getById(orderStore, order_id)) {
      case null { #err("Order not found") };
      case (?_order) {
        // Create shipment
        let (newOperationsStore, shipment) = Operations.createShipment(operationsStore, order_id, null);
        operationsStore := newOperationsStore;
        #ok(shipment)
      };
    }
  };

  // ================================
  // EMPLOYEE & OPERATIONS MANAGEMENT
  // ================================

  public shared(msg) func createEmployee(company_id : Nat, retailer_id : ?Nat, contact : Text, truck_id : ?Nat) : async Result<Operations.Employee, Text> {
    let caller = msg.caller;
    if (not Auth.isAuthenticated(caller)) {
      return #err("Not authenticated");
    };

    let (newOperationsStore, employee) = Operations.createEmployee(operationsStore, company_id, retailer_id, caller, contact, truck_id);
    operationsStore := newOperationsStore;
    #ok(employee)
  };

  public shared(msg) func getEmployees(company_id : ?Nat) : async Result<[Operations.Employee], Text> {
    let caller = msg.caller;
    if (not Auth.isAuthenticated(caller)) {
      return #err("Not authenticated");
    };

    let employees = switch (company_id) {
      case null { Operations.getAllEmployees(operationsStore) };
      case (?id) { Operations.getEmployeesByCompany(operationsStore, id) };
    };
    #ok(employees)
  };

  public shared(msg) func createTruck(company_id : Nat, license_plate : Text, capacity : Nat) : async Result<Operations.Truck, Text> {
    let caller = msg.caller;
    if (not Auth.isAuthenticated(caller) or not Auth.hasRole(authSessions, caller, "admin")) {
      return #err("Admin access required");
    };

    let (newOperationsStore, truck) = Operations.createTruck(operationsStore, company_id, license_plate, capacity);
    operationsStore := newOperationsStore;
    #ok(truck)
  };

  public shared(msg) func getTrucks(company_id : ?Nat) : async Result<[Operations.Truck], Text> {
    let caller = msg.caller;
    if (not Auth.isAuthenticated(caller)) {
      return #err("Not authenticated");
    };

    let trucks = switch (company_id) {
      case null { Operations.getAllTrucks(operationsStore) };
      case (?id) { Operations.getTrucksByCompany(operationsStore, id) };
    };
    #ok(trucks)
  };

  public shared(msg) func allocateOrder(order_id : Nat, employee_id : Nat) : async Result<Text, Text> {
    let caller = msg.caller;
    if (not Auth.isAuthenticated(caller)) {
      return #err("Not authenticated");
    };

    // Get existing shipment
    switch (Operations.getShipmentByOrder(operationsStore, order_id)) {
      case null { #err("Shipment not found. Approve the order first.") };
      case (?shipment) {
        // Check if already allocated
        switch (shipment.employee_id) {
          case (?_) { #err("Order already allocated") };
          case null {
            // Assign employee
            let (newOperationsStore, result) = Operations.assignEmployeeToShipment(operationsStore, shipment.id, employee_id);
            operationsStore := newOperationsStore;
            switch (result) {
              case null { #err("Failed to assign employee") };
              case (?_) {
                // Update order status
                let (newOrderStore, _) = Order.updateStatus(orderStore, order_id, "allocated");
                orderStore := newOrderStore;
                #ok("Order allocated successfully")
              };
            }
          };
        }
      };
    }
  };

  public shared(msg) func getShipments() : async Result<[Operations.Shipment], Text> {
    let caller = msg.caller;
    if (not Auth.isAuthenticated(caller)) {
      return #err("Not authenticated");
    };

    let shipments = Operations.getAllShipments(operationsStore);
    #ok(shipments)
  };

  public shared(msg) func getEmployeeShipments() : async Result<[Operations.Shipment], Text> {
    let caller = msg.caller;
    if (not Auth.isAuthenticated(caller)) {
      return #err("Not authenticated");
    };

    switch (Operations.getEmployeeByUser(operationsStore, caller)) {
      case null { #err("Employee profile not found") };
      case (?employee) {
        let shipments = Operations.getShipmentsByEmployee(operationsStore, employee.id);
        #ok(shipments)
      };
    }
  };

  public shared(msg) func updateShipmentStatus(shipment_id : Nat, status : Text) : async Result<Operations.Shipment, Text> {
    let caller = msg.caller;
    if (not Auth.isAuthenticated(caller)) {
      return #err("Not authenticated");
    };

    let (newOperationsStore, result) = Operations.updateShipmentStatus(operationsStore, shipment_id, status);
    operationsStore := newOperationsStore;
    switch (result) {
      case null { #err("Shipment not found") };
      case (?shipment) {
        // If delivered, update order status
        if (status == "delivered") {
          let (newOrderStore, _) = Order.updateStatus(orderStore, shipment.order_id, "delivered");
          orderStore := newOrderStore;
        };
        #ok(shipment)
      };
    }
  };

  // ================================
  // INVOICE MANAGEMENT
  // ================================

  public shared(msg) func createInvoice(
    invoice_number : Text,
    company_id : Nat,
    retailer_id : Nat,
    invoice_date : Int,
    due_date : ?Int,
    payment_mode : Text,
    items : [(Nat, Nat, Float, Float, Float, Float, Float, Float, Text)]
  ) : async Result<Business.Invoice, Text> {
    let caller = msg.caller;
    if (not Auth.isAuthenticated(caller)) {
      return #err("Not authenticated");
    };

    let (newBusinessStore, invoice) = Business.createInvoice(businessStore, invoice_number, company_id, retailer_id, invoice_date, due_date, payment_mode, items);
    businessStore := newBusinessStore;
    #ok(invoice)
  };

  public shared(msg) func getInvoices(company_id : ?Nat) : async Result<[Business.Invoice], Text> {
    let caller = msg.caller;
    if (not Auth.isAuthenticated(caller)) {
      return #err("Not authenticated");
    };

    let invoices = switch (company_id) {
      case null { Business.getAllInvoices(businessStore) };
      case (?id) { Business.getInvoicesByCompany(businessStore, id) };
    };
    #ok(invoices)
  };

  public shared(msg) func getInvoiceCount(company_id : Nat) : async Result<Nat, Text> {
    let caller = msg.caller;
    if (not Auth.isAuthenticated(caller)) {
      return #err("Not authenticated");
    };

    let invoices = Business.getInvoicesByCompany(businessStore, company_id);
    #ok(invoices.size())
  };

  // ================================
  // STATS & ANALYTICS
  // ================================

  public shared(msg) func getCounts(company_id : Nat) : async Result<{orders_placed : Nat; pending_orders : Nat; employees_available : Nat; retailers_available : Nat}, Text> {
    let caller = msg.caller;
    if (not Auth.isAuthenticated(caller)) {
      return #err("Not authenticated");
    };

    let retailers = Retailer.getByCompany(retailerStore, company_id);
    let employees = Operations.getEmployeesByCompany(operationsStore, company_id);
    let allOrders = Order.getAll(orderStore);
    let pendingOrders = Order.getByStatus(orderStore, "pending");

    // Filter orders by company's retailers
    let retailerIds = Array.map<Retailer.Retailer, Nat>(retailers, func(r) { r.id });
    let companyOrders = Array.filter<Order.Order>(allOrders, func(o) {
      Array.find<Nat>(retailerIds, func(id) { id == o.retailer_id }) != null
    });
    let companyPendingOrders = Array.filter<Order.Order>(pendingOrders, func(o) {
      Array.find<Nat>(retailerIds, func(id) { id == o.retailer_id }) != null
    });

    #ok({
      orders_placed = companyOrders.size();
      pending_orders = companyPendingOrders.size();
      employees_available = employees.size();
      retailers_available = retailers.size();
    })
  };

  public shared(msg) func getRetailerCounts() : async Result<{connected_companies : Nat; total_orders : Nat; pending_requests : Nat}, Text> {
    let caller = msg.caller;
    if (not Auth.isAuthenticated(caller)) {
      return #err("Not authenticated");
    };

    switch (RetailerProfile.getByUser(retailerProfileStore, caller)) {
      case null { #err("Retailer profile not found") };
      case (?profile) {
        let connections = Business.getConnectionsByRetailer(businessStore, profile.id);
        let approvedConnections = Array.filter<Business.CompanyRetailerConnection>(connections, func(c) { c.status == "approved" });
        
        // Count orders (placeholder - would need to implement retailer-specific order filtering)
        let orders = Order.getAll(orderStore);
        
        #ok({
          connected_companies = approvedConnections.size();
          total_orders = orders.size(); // Placeholder
          pending_requests = 0; // Placeholder
        })
      };
    }
  };

  // ================================
  // PASSWORD RESET & OTP
  // ================================

  public shared(msg) func forgotPassword(username : Text, email : Text) : async Result<Text, Text> {
    switch (Business.getUserByUsername(businessStore, username)) {
      case null { #err("User not found") };
      case (?user) {
        if (user.email != email) {
          return #err("Email does not match");
        };
        
        let otp = Auth.generateOTP();
        let emailResult = await Email.sendOTPEmail(email, otp, username);
        
        if (emailResult.success) {
          #ok("OTP sent successfully")
        } else {
          #err("Failed to send OTP")
        }
      };
    }
  };

  public func verifyOTP(username : Text, otp : Text) : async Result<Text, Text> {
    // Placeholder OTP verification
    if (otp == "123456") {
      #ok("OTP verified successfully")
    } else {
      #err("Invalid OTP")
    }
  };

  public func resetPassword(username : Text, new_password : Text, otp : Text) : async Result<Text, Text> {
    if (not Auth.validatePassword(new_password)) {
      return #err("Password must be at least 6 characters");
    };

    // Verify OTP first
    switch (await verifyOTP(username, otp)) {
      case (#err(msg)) { #err(msg) };
      case (#ok(_)) {
        // Update password (would need to implement user update function)
        let confirmationResult = await Email.sendPasswordResetConfirmation("user@example.com", username);
        #ok("Password reset successfully")
      };
    }
  };

  // ================================
  // UTILITY FUNCTIONS
  // ================================

  public shared(msg) func storeQRCode(qr_text : Text) : async Result<Text, Text> {
    let caller = msg.caller;
    if (not Auth.isAuthenticated(caller) or not Auth.hasRole(authSessions, caller, "admin")) {
      return #err("Admin access required");
    };

    // Parse QR code data (placeholder implementation)
    #ok("QR code processed successfully")
  };

  public func getCategoryStockData() : async [{name : Text; value : Nat}] {
    let categories = Category.getAll(categoryStore);
    let products = Product.getAll(productStore);

    Array.map<Category.Category, {name : Text; value : Nat}>(categories, func(cat) {
      let categoryProducts = Array.filter<Product.Product>(products, func(p) {
        switch (p.category_id) {
          case (?id) { id == cat.id };
          case null { false };
        }
      });
      {
        name = cat.name;
        value = categoryProducts.size();
      }
    })
  };

  // ================================
  // COMPANY-RETAILER CONNECTIONS
  // ================================

  public shared(msg) func requestCompanyApproval(company_id : Nat, message : Text) : async Result<Text, Text> {
    let caller = msg.caller;
    if (not Auth.isAuthenticated(caller)) {
      return #err("Not authenticated");
    };

    switch (RetailerProfile.getByUser(retailerProfileStore, caller)) {
      case null { #err("Retailer profile required") };
      case (?_profile) {
        // Create connection request (would implement in Business module)
        #ok("Request sent successfully")
      };
    }
  };

  public shared(msg) func acceptRetailerRequest(request_id : Nat, action : Text, credit_limit : Float, payment_terms : Text) : async Result<Text, Text> {
    let caller = msg.caller;
    if (not Auth.isAuthenticated(caller)) {
      return #err("Not authenticated");
    };

    if (action == "approve") {
      // Create connection (would implement proper request handling)
      #ok("Request approved")
    } else {
      #ok("Request rejected")
    }
  };

  public shared(msg) func getCompanyConnections(company_id : Nat, status : Text) : async Result<[Business.CompanyRetailerConnection], Text> {
    let caller = msg.caller;
    if (not Auth.isAuthenticated(caller)) {
      return #err("Not authenticated");
    };

    let connections = Business.getConnectionsByCompany(businessStore, company_id);
    let filteredConnections = Array.filter<Business.CompanyRetailerConnection>(connections, func(c) { c.status == status });
    #ok(filteredConnections)
  };

  // Health check
  public func health() : async Text {
    "Vendor Backend Canister is running"
  };
}

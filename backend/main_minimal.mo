import Text "mo:base/Text";
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

actor VendorBackend {
  type Result<T, E> = Result.Result<T, E>;

  // Stable storage for all models
  private stable var companyStore : Company.CompanyStore = Company.emptyStore();
  private stable var categoryStore : Category.CategoryStore = Category.emptyStore();
  private stable var productStore : Product.ProductStore = Product.emptyStore();
  private stable var _retailerStore : Retailer.RetailerStore = Retailer.emptyStore();
  private stable var _retailerProfileStore : RetailerProfile.RetailerProfileStore = RetailerProfile.emptyStore();
  private stable var _orderStore : Order.OrderStore = Order.emptyStore();
  private stable var _operationsStore : Operations.OperationsStore = Operations.emptyStore();
  private stable var businessStore : Business.BusinessStore = Business.emptyStore();
  private stable var authSessions : [Auth.AuthSession] = [];

  // ================================
  // AUTHENTICATION & USER MANAGEMENT
  // ================================

  public shared(msg) func register(username : Text, email : Text, password : Text, groups : [Text]) : async Result<Business.User, Text> {
    let caller = msg.caller;
    
    // Check if user already exists
    switch (Business.getUserByUsername(businessStore, username)) {
      case (?_existingUser) { #err("Username already exists") };
      case null {
        if (not Auth.validatePassword(password)) {
          return #err("Password must be at least 6 characters");
        };
        
        let passwordHash = Auth.hashPassword(password);
        let (newBusinessStore, user) = Business.createUser(businessStore, caller, username, email, passwordHash, false, groups);
        businessStore := newBusinessStore;
        let (newAuthSessions, _session) = Auth.createSession(authSessions, caller, groups);
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
          let (newAuthSessions, _session) = Auth.createSession(authSessions, caller, user.groups);
          authSessions := newAuthSessions;
          #ok("Login successful")
        } else {
          #err("Invalid password")
        }
      };
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

  public shared(msg) func getMyCompanies() : async Result<[Company.Company], Text> {
    let caller = msg.caller;
    if (not Auth.isAuthenticated(caller)) {
      return #err("Not authenticated");
    };

    let companies = Company.getByOwner(companyStore, caller);
    #ok(companies)
  };

  public func getPublicCompanies() : async [Company.Company] {
    Company.getPublic(companyStore)
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

  // Health check
  public func health() : async Text {
    "Vendor Backend Canister is running - All model files fixed!"
  };

  // Get store statistics
  public func getStats() : async {companies: Nat; categories: Nat; products: Nat; users: Nat} {
    {
      companies = companyStore.companies.size();
      categories = categoryStore.categories.size();
      products = productStore.products.size();
      users = businessStore.users.size();
    }
  };
}

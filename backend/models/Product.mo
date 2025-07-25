import Array "mo:base/Array";
import Principal "mo:base/Principal";

module {
  public type Product = {
    id : Nat;
    company_id : Nat;
    name : Text;
    category_id : ?Nat;
    available_quantity : Nat;
    uqc : Text;
    total_shipped : Nat;
    total_required_quantity : Nat;
    price : Float;
    hsn_code : Text;
    cgst_rate : Float;
    sgst_rate : Float;
    igst_rate : Float;
    cess_rate : Float;
    created_by : ?Principal;
    status : Text; // "on_demand", "sufficient"
  };

  public type ProductStore = {
    products : [Product];
    nextId : Nat;
  };

  public func emptyStore() : ProductStore {
    {
      products = [];
      nextId = 1;
    }
  };

  public func create(
    store : ProductStore,
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
    cess_rate : Float,
    created_by : ?Principal
  ) : (ProductStore, Product) {
    let status = if (available_quantity > 0) "sufficient" else "on_demand";
    let product = {
      id = store.nextId;
      company_id = company_id;
      name = name;
      category_id = category_id;
      available_quantity = available_quantity;
      uqc = uqc;
      total_shipped = 0;
      total_required_quantity = 0;
      price = price;
      hsn_code = hsn_code;
      cgst_rate = cgst_rate;
      sgst_rate = sgst_rate;
      igst_rate = igst_rate;
      cess_rate = cess_rate;
      created_by = created_by;
      status = status;
    };
    let newStore = {
      products = Array.append(store.products, [product]);
      nextId = store.nextId + 1;
    };
    (newStore, product)
  };

  public func getById(store : ProductStore, id : Nat) : ?Product {
    Array.find<Product>(store.products, func(p) { p.id == id })
  };

  public func getByCompany(store : ProductStore, company_id : Nat) : [Product] {
    Array.filter<Product>(store.products, func(p) { p.company_id == company_id })
  };

  public func getByCategory(store : ProductStore, category_id : Nat) : [Product] {
    Array.filter<Product>(store.products, func(p) { 
      switch (p.category_id) {
        case (?cat_id) { cat_id == category_id };
        case null { false };
      }
    })
  };

  public func updateQuantity(store : ProductStore, id : Nat, available_quantity : Nat, total_shipped : Nat, total_required_quantity : Nat) : (ProductStore, ?Product) {
    var index : ?Nat = null;
    var i : Nat = 0;
    for (p in store.products.vals()) {
      if (p.id == id) {
        index := ?i;
      };
      i += 1;
    };
    
    switch (index) {
      case null { (store, null) };
      case (?i) {
        let oldProduct = store.products[i];
        let status = if (available_quantity > total_required_quantity) "sufficient" else "on_demand";
        let updatedProduct = {
          id = oldProduct.id;
          company_id = oldProduct.company_id;
          name = oldProduct.name;
          category_id = oldProduct.category_id;
          available_quantity = available_quantity;
          uqc = oldProduct.uqc;
          total_shipped = total_shipped;
          total_required_quantity = total_required_quantity;
          price = oldProduct.price;
          hsn_code = oldProduct.hsn_code;
          cgst_rate = oldProduct.cgst_rate;
          sgst_rate = oldProduct.sgst_rate;
          igst_rate = oldProduct.igst_rate;
          cess_rate = oldProduct.cess_rate;
          created_by = oldProduct.created_by;
          status = status;
        };
        let newProducts = Array.tabulate<Product>(store.products.size(), func(j) {
          if (j == i) updatedProduct else store.products[j]
        });
        let newStore = {
          products = newProducts;
          nextId = store.nextId;
        };
        (newStore, ?updatedProduct)
      };
    }
  };

  public func delete(store : ProductStore, id : Nat) : (ProductStore, Bool) {
    let newProducts = Array.filter<Product>(store.products, func(p) { p.id != id });
    let deleted = newProducts.size() < store.products.size();
    let newStore = {
      products = newProducts;
      nextId = store.nextId;
    };
    (newStore, deleted)
  };

  public func getAll(store : ProductStore) : [Product] {
    store.products
  };
}

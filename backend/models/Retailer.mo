import Array "mo:base/Array";
import Time "mo:base/Time";

module {
  public type Retailer = {
    id : Nat;
    company_id : Nat;
    retailer_profile_id : ?Nat;
    name : Text;
    contact_person : ?Text;
    email : ?Text;
    contact : Text;
    address_line1 : Text;
    address_line2 : ?Text;
    city : Text;
    state : Text;
    pincode : Text;
    country : Text;
    gstin : Text;
    distance_from_warehouse : Float;
    is_active : Bool;
    created_at : Int;
    updated_at : Int;
  };

  public type RetailerStore = {
    retailers : [Retailer];
    nextId : Nat;
  };

  public func emptyStore() : RetailerStore {
    {
      retailers = [];
      nextId = 1;
    }
  };

  public func create(
    store : RetailerStore,
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
    distance_from_warehouse : Float,
    retailer_profile_id : ?Nat
  ) : (RetailerStore, Retailer) {
    let now = Time.now();
    let retailer = {
      id = store.nextId;
      company_id = company_id;
      retailer_profile_id = retailer_profile_id;
      name = name;
      contact_person = contact_person;
      email = email;
      contact = contact;
      address_line1 = address_line1;
      address_line2 = address_line2;
      city = city;
      state = state;
      pincode = pincode;
      country = country;
      gstin = gstin;
      distance_from_warehouse = distance_from_warehouse;
      is_active = true;
      created_at = now;
      updated_at = now;
    };
    let newStore = {
      retailers = Array.append(store.retailers, [retailer]);
      nextId = store.nextId + 1;
    };
    (newStore, retailer)
  };

  public func getById(store : RetailerStore, id : Nat) : ?Retailer {
    Array.find<Retailer>(store.retailers, func(r) { r.id == id })
  };

  public func getByCompany(store : RetailerStore, company_id : Nat) : [Retailer] {
    Array.filter<Retailer>(store.retailers, func(r) { r.company_id == company_id })
  };

  public func updateStatus(store : RetailerStore, id : Nat, is_active : Bool) : (RetailerStore, ?Retailer) {
    var index : ?Nat = null;
    var i : Nat = 0;
    for (r in store.retailers.vals()) {
      if (r.id == id) {
        index := ?i;
      };
      i += 1;
    };
    
    switch (index) {
      case null { (store, null) };
      case (?i) {
        let oldRetailer = store.retailers[i];
        let updatedRetailer = {
          id = oldRetailer.id;
          company_id = oldRetailer.company_id;
          retailer_profile_id = oldRetailer.retailer_profile_id;
          name = oldRetailer.name;
          contact_person = oldRetailer.contact_person;
          email = oldRetailer.email;
          contact = oldRetailer.contact;
          address_line1 = oldRetailer.address_line1;
          address_line2 = oldRetailer.address_line2;
          city = oldRetailer.city;
          state = oldRetailer.state;
          pincode = oldRetailer.pincode;
          country = oldRetailer.country;
          gstin = oldRetailer.gstin;
          distance_from_warehouse = oldRetailer.distance_from_warehouse;
          is_active = is_active;
          created_at = oldRetailer.created_at;
          updated_at = Time.now();
        };
        let newRetailers = Array.tabulate<Retailer>(store.retailers.size(), func(j) {
          if (j == i) updatedRetailer else store.retailers[j]
        });
        let newStore = {
          retailers = newRetailers;
          nextId = store.nextId;
        };
        (newStore, ?updatedRetailer)
      };
    }
  };

  public func getAll(store : RetailerStore) : [Retailer] {
    store.retailers
  };
}

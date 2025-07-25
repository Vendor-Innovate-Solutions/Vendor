import Array "mo:base/Array";
import Time "mo:base/Time";
import Principal "mo:base/Principal";

module {
  public type Company = {
    id : Nat;
    owner : Principal;
    name : Text;
    gstin : Text;
    address : Text;
    state : Text;
    city : Text;
    pincode : Text;
    phone : ?Text;
    email : ?Text;
    is_public : Bool;
    description : ?Text;
    created_at : Int;
  };

  public type CompanyStore = {
    companies : [Company];
    nextId : Nat;
  };

  public func emptyStore() : CompanyStore {
    {
      companies = [];
      nextId = 1;
    }
  };

  public func create(store : CompanyStore, name : Text, gstin : Text, address : Text, state : Text, city : Text, pincode : Text, phone : ?Text, email : ?Text, is_public : Bool, description : ?Text, owner : Principal) : (CompanyStore, Company) {
    let company = {
      id = store.nextId;
      owner = owner;
      name = name;
      gstin = gstin;
      address = address;
      state = state;
      city = city;
      pincode = pincode;
      phone = phone;
      email = email;
      is_public = is_public;
      description = description;
      created_at = Time.now();
    };
    let newStore = {
      companies = Array.append(store.companies, [company]);
      nextId = store.nextId + 1;
    };
    (newStore, company)
  };

  public func getById(store : CompanyStore, id : Nat) : ?Company {
    Array.find<Company>(store.companies, func(c) { c.id == id })
  };

  public func getByOwner(store : CompanyStore, owner : Principal) : [Company] {
    Array.filter<Company>(store.companies, func(c) { c.owner == owner })
  };

  public func getPublic(store : CompanyStore) : [Company] {
    Array.filter<Company>(store.companies, func(c) { c.is_public })
  };

  public func update(store : CompanyStore, id : Nat, name : Text, gstin : Text, address : Text, state : Text, city : Text, pincode : Text, phone : ?Text, email : ?Text, is_public : Bool, description : ?Text) : (CompanyStore, ?Company) {
    var index : ?Nat = null;
    var i : Nat = 0;
    for (c in store.companies.vals()) {
      if (c.id == id) {
        index := ?i;
      };
      i += 1;
    };
    
    switch (index) {
      case null { (store, null) };
      case (?i) {
        let oldCompany = store.companies[i];
        let updatedCompany = {
          id = oldCompany.id;
          owner = oldCompany.owner;
          name = name;
          gstin = gstin;
          address = address;
          state = state;
          city = city;
          pincode = pincode;
          phone = phone;
          email = email;
          is_public = is_public;
          description = description;
          created_at = oldCompany.created_at;
        };
        let newCompanies = Array.tabulate<Company>(store.companies.size(), func(j) {
          if (j == i) updatedCompany else store.companies[j]
        });
        let newStore = {
          companies = newCompanies;
          nextId = store.nextId;
        };
        (newStore, ?updatedCompany)
      };
    }
  };

  public func delete(store : CompanyStore, id : Nat) : (CompanyStore, Bool) {
    let newCompanies = Array.filter<Company>(store.companies, func(c) { c.id != id });
    let deleted = newCompanies.size() < store.companies.size();
    let newStore = {
      companies = newCompanies;
      nextId = store.nextId;
    };
    (newStore, deleted)
  };

  public func getAll(store : CompanyStore) : [Company] {
    store.companies
  };
}

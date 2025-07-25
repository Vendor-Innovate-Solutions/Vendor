import Array "mo:base/Array";
import Principal "mo:base/Principal";
import Time "mo:base/Time";

module {
  public type RetailerProfile = {
    id : Nat;
    user : Principal;
    business_name : Text;
    contact_person : Text;
    phone : Text;
    email : Text;
    address_line1 : Text;
    address_line2 : ?Text;
    city : Text;
    state : Text;
    pincode : Text;
    country : Text;
    gstin : ?Text;
    business_type : ?Text;
    established_year : ?Nat;
    is_verified : Bool;
    created_at : Int;
    updated_at : Int;
  };

  public type RetailerProfileStore = {
    retailer_profiles : [RetailerProfile];
    nextId : Nat;
  };

  public func emptyStore() : RetailerProfileStore {
    {
      retailer_profiles = [];
      nextId = 1;
    }
  };

  public func create(
    store : RetailerProfileStore,
    user : Principal,
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
  ) : (RetailerProfileStore, RetailerProfile) {
    let now = Time.now();
    let profile = {
      id = store.nextId;
      user = user;
      business_name = business_name;
      contact_person = contact_person;
      phone = phone;
      email = email;
      address_line1 = address_line1;
      address_line2 = address_line2;
      city = city;
      state = state;
      pincode = pincode;
      country = country;
      gstin = gstin;
      business_type = business_type;
      established_year = established_year;
      is_verified = false;
      created_at = now;
      updated_at = now;
    };
    let newStore = {
      retailer_profiles = Array.append(store.retailer_profiles, [profile]);
      nextId = store.nextId + 1;
    };
    (newStore, profile)
  };

  public func getById(store : RetailerProfileStore, id : Nat) : ?RetailerProfile {
    Array.find<RetailerProfile>(store.retailer_profiles, func(r) { r.id == id })
  };

  public func getByUser(store : RetailerProfileStore, user : Principal) : ?RetailerProfile {
    Array.find<RetailerProfile>(store.retailer_profiles, func(r) { r.user == user })
  };

  public func update(
    store : RetailerProfileStore,
    id : Nat,
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
  ) : (RetailerProfileStore, ?RetailerProfile) {
    var index : ?Nat = null;
    var i : Nat = 0;
    for (r in store.retailer_profiles.vals()) {
      if (r.id == id) {
        index := ?i;
      };
      i += 1;
    };
    
    switch (index) {
      case null { (store, null) };
      case (?i) {
        let oldProfile = store.retailer_profiles[i];
        let updatedProfile = {
          id = oldProfile.id;
          user = oldProfile.user;
          business_name = business_name;
          contact_person = contact_person;
          phone = phone;
          email = email;
          address_line1 = address_line1;
          address_line2 = address_line2;
          city = city;
          state = state;
          pincode = pincode;
          country = country;
          gstin = gstin;
          business_type = business_type;
          established_year = established_year;
          is_verified = oldProfile.is_verified;
          created_at = oldProfile.created_at;
          updated_at = Time.now();
        };
        let newProfiles = Array.tabulate<RetailerProfile>(store.retailer_profiles.size(), func(j) {
          if (j == i) updatedProfile else store.retailer_profiles[j]
        });
        let newStore = {
          retailer_profiles = newProfiles;
          nextId = store.nextId;
        };
        (newStore, ?updatedProfile)
      };
    }
  };

  public func getAll(store : RetailerProfileStore) : [RetailerProfile] {
    store.retailer_profiles
  };
}

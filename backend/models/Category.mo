import Array "mo:base/Array";

module {
  public type Category = {
    id : Nat;
    company_id : Nat;
    name : Text;
  };

  public type CategoryStore = {
    categories : [Category];
    nextId : Nat;
  };

  public func emptyStore() : CategoryStore {
    {
      categories = [];
      nextId = 1;
    }
  };

  public func create(store : CategoryStore, company_id : Nat, name : Text) : (CategoryStore, Category) {
    let category = {
      id = store.nextId;
      company_id = company_id;
      name = name;
    };
    let newStore = {
      categories = Array.append(store.categories, [category]);
      nextId = store.nextId + 1;
    };
    (newStore, category)
  };

  public func getById(store : CategoryStore, id : Nat) : ?Category {
    Array.find<Category>(store.categories, func(c) { c.id == id })
  };

  public func getByCompany(store : CategoryStore, company_id : Nat) : [Category] {
    Array.filter<Category>(store.categories, func(c) { c.company_id == company_id })
  };

  public func update(store : CategoryStore, id : Nat, name : Text) : (CategoryStore, ?Category) {
    var index : ?Nat = null;
    var i : Nat = 0;
    for (c in store.categories.vals()) {
      if (c.id == id) {
        index := ?i;
      };
      i += 1;
    };
    
    switch (index) {
      case null { (store, null) };
      case (?i) {
        let oldCategory = store.categories[i];
        let updatedCategory = {
          id = oldCategory.id;
          company_id = oldCategory.company_id;
          name = name;
        };
        let newCategories = Array.tabulate<Category>(store.categories.size(), func(j) {
          if (j == i) updatedCategory else store.categories[j]
        });
        let newStore = {
          categories = newCategories;
          nextId = store.nextId;
        };
        (newStore, ?updatedCategory)
      };
    }
  };

  public func delete(store : CategoryStore, id : Nat) : (CategoryStore, Bool) {
    let newCategories = Array.filter<Category>(store.categories, func(c) { c.id != id });
    let deleted = newCategories.size() < store.categories.size();
    let newStore = {
      categories = newCategories;
      nextId = store.nextId;
    };
    (newStore, deleted)
  };

  public func getAll(store : CategoryStore) : [Category] {
    store.categories
  };
}

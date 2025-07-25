import Array "mo:base/Array";
import Time "mo:base/Time";
import Principal "mo:base/Principal";

module {
  public type Employee = {
    id : Nat;
    company_id : Nat;
    retailer_id : ?Nat;
    user : Principal;
    contact : Text;
    truck_id : ?Nat;
  };

  public type Truck = {
    id : Nat;
    company_id : Nat;
    license_plate : Text;
    capacity : Nat;
    is_available : Bool;
  };

  public type Shipment = {
    id : Nat;
    order_id : Nat;
    employee_id : ?Nat;
    shipment_date : Int;
    status : Text; // "in_transit", "delivered", "failed"
  };

  public type OperationsStore = {
    employees : [Employee];
    trucks : [Truck];
    shipments : [Shipment];
    nextEmployeeId : Nat;
    nextTruckId : Nat;
    nextShipmentId : Nat;
  };

  public func emptyStore() : OperationsStore {
    {
      employees = [];
      trucks = [];
      shipments = [];
      nextEmployeeId = 1;
      nextTruckId = 1;
      nextShipmentId = 1;
    }
  };

  // Employee functions
  public func createEmployee(store : OperationsStore, company_id : Nat, retailer_id : ?Nat, user : Principal, contact : Text, truck_id : ?Nat) : (OperationsStore, Employee) {
    let employee = {
      id = store.nextEmployeeId;
      company_id = company_id;
      retailer_id = retailer_id;
      user = user;
      contact = contact;
      truck_id = truck_id;
    };
    let newStore = {
      employees = Array.append(store.employees, [employee]);
      trucks = store.trucks;
      shipments = store.shipments;
      nextEmployeeId = store.nextEmployeeId + 1;
      nextTruckId = store.nextTruckId;
      nextShipmentId = store.nextShipmentId;
    };
    (newStore, employee)
  };

  public func getEmployeeById(store : OperationsStore, id : Nat) : ?Employee {
    Array.find<Employee>(store.employees, func(e) { e.id == id })
  };

  public func getEmployeesByCompany(store : OperationsStore, company_id : Nat) : [Employee] {
    Array.filter<Employee>(store.employees, func(e) { e.company_id == company_id })
  };

  public func getEmployeeByUser(store : OperationsStore, user : Principal) : ?Employee {
    Array.find<Employee>(store.employees, func(e) { e.user == user })
  };

  // Truck functions
  public func createTruck(store : OperationsStore, company_id : Nat, license_plate : Text, capacity : Nat) : (OperationsStore, Truck) {
    let truck = {
      id = store.nextTruckId;
      company_id = company_id;
      license_plate = license_plate;
      capacity = capacity;
      is_available = true;
    };
    let newStore = {
      employees = store.employees;
      trucks = Array.append(store.trucks, [truck]);
      shipments = store.shipments;
      nextEmployeeId = store.nextEmployeeId;
      nextTruckId = store.nextTruckId + 1;
      nextShipmentId = store.nextShipmentId;
    };
    (newStore, truck)
  };

  public func getTruckById(store : OperationsStore, id : Nat) : ?Truck {
    Array.find<Truck>(store.trucks, func(t) { t.id == id })
  };

  public func getTrucksByCompany(store : OperationsStore, company_id : Nat) : [Truck] {
    Array.filter<Truck>(store.trucks, func(t) { t.company_id == company_id })
  };

  public func updateTruckAvailability(store : OperationsStore, id : Nat, is_available : Bool) : (OperationsStore, ?Truck) {
    var index : ?Nat = null;
    var i : Nat = 0;
    for (t in store.trucks.vals()) {
      if (t.id == id) {
        index := ?i;
      };
      i += 1;
    };
    
    switch (index) {
      case null { (store, null) };
      case (?i) {
        let oldTruck = store.trucks[i];
        let updatedTruck = {
          id = oldTruck.id;
          company_id = oldTruck.company_id;
          license_plate = oldTruck.license_plate;
          capacity = oldTruck.capacity;
          is_available = is_available;
        };
        let newTrucks = Array.tabulate<Truck>(store.trucks.size(), func(j) {
          if (j == i) updatedTruck else store.trucks[j]
        });
        let newStore = {
          employees = store.employees;
          trucks = newTrucks;
          shipments = store.shipments;
          nextEmployeeId = store.nextEmployeeId;
          nextTruckId = store.nextTruckId;
          nextShipmentId = store.nextShipmentId;
        };
        (newStore, ?updatedTruck)
      };
    }
  };

  // Shipment functions
  public func createShipment(store : OperationsStore, order_id : Nat, employee_id : ?Nat) : (OperationsStore, Shipment) {
    let shipment = {
      id = store.nextShipmentId;
      order_id = order_id;
      employee_id = employee_id;
      shipment_date = Time.now();
      status = "in_transit";
    };
    let newStore = {
      employees = store.employees;
      trucks = store.trucks;
      shipments = Array.append(store.shipments, [shipment]);
      nextEmployeeId = store.nextEmployeeId;
      nextTruckId = store.nextTruckId;
      nextShipmentId = store.nextShipmentId + 1;
    };
    (newStore, shipment)
  };

  public func getShipmentById(store : OperationsStore, id : Nat) : ?Shipment {
    Array.find<Shipment>(store.shipments, func(s) { s.id == id })
  };

  public func getShipmentByOrder(store : OperationsStore, order_id : Nat) : ?Shipment {
    Array.find<Shipment>(store.shipments, func(s) { s.order_id == order_id })
  };

  public func getShipmentsByEmployee(store : OperationsStore, employee_id : Nat) : [Shipment] {
    Array.filter<Shipment>(store.shipments, func(s) { 
      switch (s.employee_id) {
        case (?emp_id) { emp_id == employee_id };
        case null { false };
      }
    })
  };

  public func updateShipmentStatus(store : OperationsStore, id : Nat, status : Text) : (OperationsStore, ?Shipment) {
    var index : ?Nat = null;
    var i : Nat = 0;
    for (s in store.shipments.vals()) {
      if (s.id == id) {
        index := ?i;
      };
      i += 1;
    };
    
    switch (index) {
      case null { (store, null) };
      case (?i) {
        let oldShipment = store.shipments[i];
        let updatedShipment = {
          id = oldShipment.id;
          order_id = oldShipment.order_id;
          employee_id = oldShipment.employee_id;
          shipment_date = oldShipment.shipment_date;
          status = status;
        };
        let newShipments = Array.tabulate<Shipment>(store.shipments.size(), func(j) {
          if (j == i) updatedShipment else store.shipments[j]
        });
        let newStore = {
          employees = store.employees;
          trucks = store.trucks;
          shipments = newShipments;
          nextEmployeeId = store.nextEmployeeId;
          nextTruckId = store.nextTruckId;
          nextShipmentId = store.nextShipmentId;
        };
        (newStore, ?updatedShipment)
      };
    }
  };

  public func assignEmployeeToShipment(store : OperationsStore, shipment_id : Nat, employee_id : Nat) : (OperationsStore, ?Shipment) {
    var index : ?Nat = null;
    var i : Nat = 0;
    for (s in store.shipments.vals()) {
      if (s.id == shipment_id) {
        index := ?i;
      };
      i += 1;
    };
    
    switch (index) {
      case null { (store, null) };
      case (?i) {
        let oldShipment = store.shipments[i];
        let updatedShipment = {
          id = oldShipment.id;
          order_id = oldShipment.order_id;
          employee_id = ?employee_id;
          shipment_date = oldShipment.shipment_date;
          status = oldShipment.status;
        };
        let newShipments = Array.tabulate<Shipment>(store.shipments.size(), func(j) {
          if (j == i) updatedShipment else store.shipments[j]
        });
        let newStore = {
          employees = store.employees;
          trucks = store.trucks;
          shipments = newShipments;
          nextEmployeeId = store.nextEmployeeId;
          nextTruckId = store.nextTruckId;
          nextShipmentId = store.nextShipmentId;
        };
        (newStore, ?updatedShipment)
      };
    }
  };

  public func getAllEmployees(store : OperationsStore) : [Employee] {
    store.employees
  };

  public func getAllTrucks(store : OperationsStore) : [Truck] {
    store.trucks
  };

  public func getAllShipments(store : OperationsStore) : [Shipment] {
    store.shipments
  };
}

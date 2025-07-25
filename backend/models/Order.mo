import Array "mo:base/Array";
import Time "mo:base/Time";

module {
  public type OrderItem = {
    id : Nat;
    order_id : Nat;
    product_id : Nat;
    quantity : Nat;
  };

  public type Order = {
    id : Nat;
    retailer_id : Nat;
    order_date : Int;
    status : Text; // "pending", "allocated", "delivered", "cancelled"
    items : [OrderItem];
  };

  public type OrderStore = {
    orders : [Order];
    order_items : [OrderItem];
    nextOrderId : Nat;
    nextItemId : Nat;
  };

  public func emptyStore() : OrderStore {
    {
      orders = [];
      order_items = [];
      nextOrderId = 1;
      nextItemId = 1;
    }
  };

  public func create(store : OrderStore, retailer_id : Nat, items : [(Nat, Nat)]) : (OrderStore, Order) {
    let order_id = store.nextOrderId;
    var nextItemId = store.nextItemId;
    
    let order_items_for_order = Array.map<(Nat, Nat), OrderItem>(items, func((product_id, quantity)) {
      let item = {
        id = nextItemId;
        order_id = order_id;
        product_id = product_id;
        quantity = quantity;
      };
      nextItemId += 1;
      item
    });
    
    let order = {
      id = order_id;
      retailer_id = retailer_id;
      order_date = Time.now();
      status = "pending";
      items = order_items_for_order;
    };
    
    let newStore = {
      orders = Array.append(store.orders, [order]);
      order_items = Array.append(store.order_items, order_items_for_order);
      nextOrderId = store.nextOrderId + 1;
      nextItemId = nextItemId;
    };
    
    (newStore, order)
  };

  public func getById(store : OrderStore, id : Nat) : ?Order {
    let orderOpt = Array.find<Order>(store.orders, func(o) { o.id == id });
    switch (orderOpt) {
      case null { null };
      case (?order) {
        let orderItems = Array.filter<OrderItem>(store.order_items, func(item) { item.order_id == id });
        ?{
          id = order.id;
          retailer_id = order.retailer_id;
          order_date = order.order_date;
          status = order.status;
          items = orderItems;
        }
      };
    }
  };

  public func getByRetailer(store : OrderStore, retailer_id : Nat) : [Order] {
    let retailerOrders = Array.filter<Order>(store.orders, func(o) { o.retailer_id == retailer_id });
    Array.map<Order, Order>(retailerOrders, func(order) {
      let orderItems = Array.filter<OrderItem>(store.order_items, func(item) { item.order_id == order.id });
      {
        id = order.id;
        retailer_id = order.retailer_id;
        order_date = order.order_date;
        status = order.status;
        items = orderItems;
      }
    })
  };

  public func updateStatus(store : OrderStore, id : Nat, status : Text) : (OrderStore, ?Order) {
    var index : ?Nat = null;
    var i : Nat = 0;
    for (o in store.orders.vals()) {
      if (o.id == id) {
        index := ?i;
      };
      i += 1;
    };
    
    switch (index) {
      case null { (store, null) };
      case (?i) {
        let oldOrder = store.orders[i];
        let orderItems = Array.filter<OrderItem>(store.order_items, func(item) { item.order_id == id });
        let updatedOrder = {
          id = oldOrder.id;
          retailer_id = oldOrder.retailer_id;
          order_date = oldOrder.order_date;
          status = status;
          items = orderItems;
        };
        let newOrders = Array.tabulate<Order>(store.orders.size(), func(j) {
          if (j == i) updatedOrder else store.orders[j]
        });
        let newStore = {
          orders = newOrders;
          order_items = store.order_items;
          nextOrderId = store.nextOrderId;
          nextItemId = store.nextItemId;
        };
        (newStore, ?updatedOrder)
      };
    }
  };

  public func getByStatus(store : OrderStore, status : Text) : [Order] {
    let statusOrders = Array.filter<Order>(store.orders, func(o) { o.status == status });
    Array.map<Order, Order>(statusOrders, func(order) {
      let orderItems = Array.filter<OrderItem>(store.order_items, func(item) { item.order_id == order.id });
      {
        id = order.id;
        retailer_id = order.retailer_id;
        order_date = order.order_date;
        status = order.status;
        items = orderItems;
      }
    })
  };

  public func getAll(store : OrderStore) : [Order] {
    Array.map<Order, Order>(store.orders, func(order) {
      let orderItems = Array.filter<OrderItem>(store.order_items, func(item) { item.order_id == order.id });
      {
        id = order.id;
        retailer_id = order.retailer_id;
        order_date = order.order_date;
        status = order.status;
        items = orderItems;
      }
    })
  };
}

import Time "mo:core/Time";
import Text "mo:core/Text";
import Order "mo:core/Order";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  module Routine {
    public func compareByTime(a : Routine, b : Routine) : Order.Order {
      Text.compare(a.scheduledTime, b.scheduledTime);
    };
  };

  module Task {
    public func compare(task1 : Task, task2 : Task) : Order.Order {
      Text.compare(task1.title, task2.title);
    };
  };

  module Restaurant {
    public func compare(restaurant1 : Restaurant, restaurant2 : Restaurant) : Order.Order {
      Text.compare(restaurant1.name, restaurant2.name);
    };
  };

  module OrderHistoryEntry {
    public type Category = {
      #timestamp;
      #restaurantName;
      #status;
      #totalPrice;
    };

    public func compare(entry1 : OrderHistoryEntry, entry2 : OrderHistoryEntry) : Order.Order {
      Text.compare(entry1.restaurantName, entry2.restaurantName);
    };

    public func compareBy(category : Category) : (OrderHistoryEntry, OrderHistoryEntry) -> Order.Order {
      switch (category) {
        case (#timestamp) {
          func(e1, e2) { Int.compare(e1.timestamp, e2.timestamp) };
        };
        case (#restaurantName) {
          func(e1, e2) { Text.compare(e1.restaurantName, e2.restaurantName) };
        };
        case (#status) {
          func(e1, e2) { Text.compare(e1.status, e2.status) };
        };
        case (#totalPrice) {
          func(e1, e2) { Float.compare(e1.totalPrice, e2.totalPrice) };
        };
      };
    };
  };

  module MenuItem {
    public func compare(menuItem1 : MenuItem, menuItem2 : MenuItem) : Order.Order {
      Text.compare(menuItem1.name, menuItem2.name);
    };
  };

  type MenuItem = {
    name : Text;
    description : Text;
    price : Float;
  };

  type Restaurant = {
    name : Text;
    cuisine : Text;
    menu : [MenuItem];
  };

  type FoodOrder = {
    restaurant : Restaurant;
    items : [MenuItem];
    totalAmount : Float;
    deliveryAddress : Text;
    paymentMode : Text;
    orderStatus : Text;
  };

  type Task = {
    title : Text;
    description : Text;
    isCompleted : Bool;
  };

  type Routine = {
    name : Text;
    scheduledTime : Text;
    isActive : Bool;
  };

  type DashboardStats = {
    activeTaskCount : Nat;
    recentOrderCount : Nat;
    activeJobCount : Nat;
  };

  type FoodOrderInput = {
    restaurantId : Nat;
    itemIds : [Nat];
    deliveryAddress : Text;
    paymentMode : Text;
  };

  type OrderStatus = {
    #pending;
    #preparing;
    #delivered;
  };

  type OrderHistoryEntry = {
    restaurantName : Text;
    items : [MenuItem];
    totalPrice : Float;
    deliveryAddress : Text;
    paymentMode : Text;
    status : Text;
    timestamp : Int;
  };

  type TaskStatus = {
    #pending;
    #completed;
  };

  public type UserProfile = {
    name : Text;
    aiAgentName : Text;
  };

  type UserData = {
    profile : UserProfile;
    orders : Map.Map<Nat, FoodOrder>;
    tasks : Map.Map<Nat, Task>;
    dailyRoutines : Map.Map<Nat, Routine>;
    orderHistory : Map.Map<Nat, OrderHistoryEntry>;
    nextOrderId : Nat;
    nextTaskId : Nat;
    nextRoutineId : Nat;
  };

  let restaurants = Map.fromIter<Nat, Restaurant>(
    [
      (0, {
        name = "Pizza Palace";
        cuisine = "Italian";
        menu = [{ name = "Margherita Pizza"; description = "Classic cheese and tomato pizza"; price = 10.99 }];
      }),
      (1, {
        name = "Sushi Central";
        cuisine = "Japanese";
        menu = [{ name = "Salmon Nigiri"; description = "Fresh salmon over rice"; price = 8.99 }];
      }),
    ].values()
  );

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let userData = Map.empty<Principal, UserData>();

  func getUserData(user : Principal) : UserData {
    switch (userData.get(user)) {
      case (?data) { data };
      case (null) {
        let newData : UserData = {
          profile = {
            name = "";
            aiAgentName = "My AI Agent";
          };
          orders = Map.empty<Nat, FoodOrder>();
          tasks = Map.empty<Nat, Task>();
          dailyRoutines = Map.empty<Nat, Routine>();
          orderHistory = Map.empty<Nat, OrderHistoryEntry>();
          nextOrderId = 0;
          nextTaskId = 0;
          nextRoutineId = 0;
        };
        userData.add(user, newData);
        newData;
      };
    };
  };

  func setUserData(user : Principal, data : UserData) {
    userData.add(user, data);
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get profiles");
    };
    let data = getUserData(caller);
    ?data.profile;
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    let data = getUserData(user);
    ?data.profile;
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    let data = getUserData(caller);
    let updatedData : UserData = {
      data with profile = profile;
    };
    setUserData(caller, updatedData);
  };

  public query ({ caller }) func getAIAgentName() : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get the AI agent's name");
    };
    let data = getUserData(caller);
    data.profile.aiAgentName;
  };

  public shared ({ caller }) func updateAIAgentName(newName : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update the AI agent's name");
    };
    let data = getUserData(caller);
    let updatedProfile : UserProfile = {
      data.profile with aiAgentName = newName;
    };
    let updatedData : UserData = {
      data with profile = updatedProfile;
    };
    setUserData(caller, updatedData);
  };

  public query ({ caller }) func getRestaurants() : async [Restaurant] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can browse restaurants");
    };
    restaurants.values().toArray().sort();
  };

  public query ({ caller }) func getOrderHistory() : async [OrderHistoryEntry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access the order history");
    };
    let data = getUserData(caller);
    data.orderHistory.values().toArray().sort();
  };

  public shared ({ caller }) func placeOrder(orderInput : FoodOrderInput) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can place orders");
    };
    let data = getUserData(caller);
    let orderId = data.nextOrderId;

    let restaurant = switch (restaurants.get(orderInput.restaurantId)) {
      case (null) {
        Runtime.trap("Invalid restaurant ID. ");
      };
      case (?restaurant) { restaurant };
    };

    let items = orderInput.itemIds.map(
      func(itemId) {
        if (itemId >= restaurant.menu.size()) {
          Runtime.trap("Invalid menu item");
        };
        restaurant.menu[itemId];
      }
    );

    let totalAmount = items.foldLeft(
      0.0,
      func(acc, item) { acc + item.price },
    );

    let newOrder : FoodOrder = {
      restaurant;
      items;
      totalAmount;
      deliveryAddress = orderInput.deliveryAddress;
      paymentMode = orderInput.paymentMode;
      orderStatus = "Pending";
    };
    data.orders.add(orderId, newOrder);

    let orderHistoryEntry : OrderHistoryEntry = {
      restaurantName = restaurant.name;
      items;
      totalPrice = totalAmount;
      deliveryAddress = newOrder.deliveryAddress;
      paymentMode = newOrder.paymentMode;
      status = "Pending";
      timestamp = Time.now();
    };
    data.orderHistory.add(orderId, orderHistoryEntry);

    let updatedData : UserData = {
      data with nextOrderId = data.nextOrderId + 1;
    };
    setUserData(caller, updatedData);

    orderId;
  };

  public shared ({ caller }) func updateOrderStatus(orderId : Nat, newStatus : OrderStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update orders");
    };
    let data = getUserData(caller);
    let order = switch (data.orders.get(orderId)) {
      case (null) {
        Runtime.trap("Order not found");
      };
      case (?order) { order };
    };

    let statusText = switch (newStatus) {
      case (#pending) { "Pending" };
      case (#preparing) { "Preparing" };
      case (#delivered) { "Delivered" };
    };

    let updatedOrder : FoodOrder = {
      order with orderStatus = statusText;
    };
    data.orders.add(orderId, updatedOrder);

    let updatedOrderHistoryEntry : OrderHistoryEntry = {
      restaurantName = order.restaurant.name;
      items = order.items;
      totalPrice = order.totalAmount;
      deliveryAddress = order.deliveryAddress;
      paymentMode = order.paymentMode;
      status = statusText;
      timestamp = Time.now();
    };
    data.orderHistory.add(orderId, updatedOrderHistoryEntry);
  };

  public shared ({ caller }) func createTask(title : Text, description : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create tasks");
    };
    let data = getUserData(caller);
    let taskId = data.nextTaskId;

    let newTask : Task = {
      title;
      description;
      isCompleted = false;
    };
    data.tasks.add(taskId, newTask);

    let updatedData : UserData = {
      data with nextTaskId = data.nextTaskId + 1;
    };
    setUserData(caller, updatedData);

    taskId;
  };

  public shared ({ caller }) func updateTaskStatus(taskId : Nat, taskStatus : TaskStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update tasks");
    };
    let data = getUserData(caller);
    let task = switch (data.tasks.get(taskId)) {
      case (null) {
        Runtime.trap("Task not found");
      };
      case (?task) { task };
    };

    let isCompleted = switch (taskStatus) {
      case (#pending) { false };
      case (#completed) { true };
    };

    let updatedTask : Task = {
      task with isCompleted;
    };
    data.tasks.add(taskId, updatedTask);
  };

  public shared ({ caller }) func deleteTask(taskId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete tasks");
    };
    let data = getUserData(caller);
    if (not data.tasks.containsKey(taskId)) {
      Runtime.trap("Task not found");
    };
    data.tasks.remove(taskId);
  };

  public shared ({ caller }) func addRoutine(name : Text, scheduledTime : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add routines");
    };
    let data = getUserData(caller);
    let routineId = data.nextRoutineId;

    let newRoutine : Routine = {
      name;
      scheduledTime;
      isActive = true;
    };
    data.dailyRoutines.add(routineId, newRoutine);

    let updatedData : UserData = {
      data with nextRoutineId = data.nextRoutineId + 1;
    };
    setUserData(caller, updatedData);

    routineId;
  };

  public shared ({ caller }) func deleteRoutine(routineId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete routines");
    };
    let data = getUserData(caller);
    if (not data.dailyRoutines.containsKey(routineId)) {
      Runtime.trap("Routine not found");
    };
    data.dailyRoutines.remove(routineId);
  };

  public shared ({ caller }) func toggleRoutine(routineId : Nat, isActive : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update routines");
    };
    let data = getUserData(caller);
    let routine = switch (data.dailyRoutines.get(routineId)) {
      case (null) {
        Runtime.trap("Routine not found");
      };
      case (?routine) { routine };
    };

    let updatedRoutine : Routine = {
      routine with isActive;
    };
    data.dailyRoutines.add(routineId, updatedRoutine);
  };

  public query ({ caller }) func getDashboardStats() : async DashboardStats {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access dashboard stats");
    };
    let data = getUserData(caller);
    let activeTaskCount = data.tasks.values().toArray().filter(func(task) { not task.isCompleted }).size();
    let recentOrderCount = data.orderHistory.size();
    let activeJobCount = data.dailyRoutines.values().toArray().filter(func(routine) { routine.isActive }).size();

    {
      activeTaskCount;
      recentOrderCount;
      activeJobCount;
    };
  };

  public query ({ caller }) func getTasks() : async [Task] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access tasks");
    };
    let data = getUserData(caller);
    data.tasks.values().toArray().sort();
  };

  public query ({ caller }) func getRoutines() : async [Routine] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access routines");
    };
    let data = getUserData(caller);
    data.dailyRoutines.values().toArray().sort(Routine.compareByTime);
  };

  public query ({ caller }) func getOrders() : async [FoodOrder] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access orders");
    };
    let data = getUserData(caller);
    data.orders.values().toArray();
  };
};

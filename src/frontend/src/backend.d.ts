import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface DashboardStats {
    recentOrderCount: bigint;
    activeTaskCount: bigint;
    activeJobCount: bigint;
}
export interface MenuItem {
    name: string;
    description: string;
    price: number;
}
export interface Task {
    title: string;
    isCompleted: boolean;
    description: string;
}
export interface OrderHistoryEntry {
    status: string;
    deliveryAddress: string;
    restaurantName: string;
    timestamp: bigint;
    paymentMode: string;
    items: Array<MenuItem>;
    totalPrice: number;
}
export interface FoodOrderInput {
    deliveryAddress: string;
    restaurantId: bigint;
    paymentMode: string;
    itemIds: Array<bigint>;
}
export interface Routine {
    scheduledTime: string;
    name: string;
    isActive: boolean;
}
export interface Restaurant {
    menu: Array<MenuItem>;
    name: string;
    cuisine: string;
}
export interface UserProfile {
    name: string;
    aiAgentName: string;
}
export interface FoodOrder {
    deliveryAddress: string;
    orderStatus: string;
    totalAmount: number;
    paymentMode: string;
    items: Array<MenuItem>;
    restaurant: Restaurant;
}
export enum OrderStatus {
    preparing = "preparing",
    pending = "pending",
    delivered = "delivered"
}
export enum TaskStatus {
    pending = "pending",
    completed = "completed"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addRoutine(name: string, scheduledTime: string): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createTask(title: string, description: string): Promise<bigint>;
    deleteRoutine(routineId: bigint): Promise<void>;
    deleteTask(taskId: bigint): Promise<void>;
    getAIAgentName(): Promise<string>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getDashboardStats(): Promise<DashboardStats>;
    getOrderHistory(): Promise<Array<OrderHistoryEntry>>;
    getOrders(): Promise<Array<FoodOrder>>;
    getRestaurants(): Promise<Array<Restaurant>>;
    getRoutines(): Promise<Array<Routine>>;
    getTasks(): Promise<Array<Task>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    placeOrder(orderInput: FoodOrderInput): Promise<bigint>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    toggleRoutine(routineId: bigint, isActive: boolean): Promise<void>;
    updateAIAgentName(newName: string): Promise<void>;
    updateOrderStatus(orderId: bigint, newStatus: OrderStatus): Promise<void>;
    updateTaskStatus(taskId: bigint, taskStatus: TaskStatus): Promise<void>;
}

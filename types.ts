
export enum OrderType {
  DINE_IN = 'Dine-In',
  TAKE_AWAY = 'Take Away'
}

export enum TableStatus {
  AVAILABLE = 'Available',
  BOOKED = 'Booked',
  OCCUPIED = 'Occupied'
}

export enum UserRole {
  ADMINISTRATOR = 'Administrator',
  STAFF = 'Staff'
}

export enum UserStatus {
  PENDING = 'Pending',
  ACTIVE = 'Active',
  REJECTED = 'Rejected'
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  status: UserStatus;
  joinedAt: Date;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  image: string;
  isDeleted?: boolean;
}

export interface OrderItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  date: Date;
  type: OrderType;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'Completed' | 'Pending' | 'Cancelled';
  tableId?: string;
}

export interface Table {
  id: string;
  number: number;
  capacity: number;
  status: TableStatus;
}

export interface Expense {
  id: string;
  date: Date;
  category: string;
  amount: number;
  description: string;
}

export interface Booking {
  id: string;
  tableName: string;
  customerName: string;
  date: string;
  time: string;
  pax: number;
}

export interface FinancialAccount {
  id: string;
  name: string;
  type: 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense';
  balance: number;
}

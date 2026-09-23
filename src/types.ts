export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  currentStock: number;
  minStock: number;
  location: string;
  sellingPrice: number;
  costPrice: number;
  expiryDate?: string;
  unit: string;
  soldCount?: number;
  revenue?: number;
  description?: string;
}

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  type: 'entry' | 'exit';
  quantity: number;
  date: string;
  reason: string;
  user: string;
  batch?: string;
  expiryDate?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  avatar: string;
}

export type TabType = 
  | 'dashboard' 
  | 'inventory' 
  | 'product-create' 
  | 'entries' 
  | 'exits' 
  | 'alerts' 
  | 'management';

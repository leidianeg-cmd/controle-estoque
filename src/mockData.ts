import { Product, StockMovement, UserProfile } from './types';

export interface AuthAccount {
  email: string;
  username: string;
  password: string;
  name: string;
  role: string;
  avatar: string;
}

// Contas e credenciais prévias configuradas no sistema
export const PREDEFINED_USERS: AuthAccount[] = [
  {
    email: 'carlos.souza@empresa.com.br',
    username: 'admin',
    password: 'admin123',
    name: 'Carlos Souza',
    role: 'Stock',
    
  },
  {
    email: 'almoxarifado@empresa.com.br',
    username: 'almoxarife',
    password: 'estoque123',
    name: 'Mariana Lima',
    role: 'Almoxarife',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
  },
];

export const initialUser: UserProfile = {
  name: 'Stock',
  email: 'carlos.souza@empresa.com.br',
  role: 'Gestão de estoque',
  avatar: '',
};

// Dados limpos conforme solicitado pelo usuário
export const initialProducts: Product[] = [];
export const initialMovements: StockMovement[] = [];

// Dados de exemplo preservados caso o usuário queira restaurar via Área Gerencial
export const sampleProducts: Product[] = [
  {
    id: '1',
    sku: 'LT-001',
    name: 'Leite Integral 1L',
    category: 'Laticínios',
    currentStock: 59,
    minStock: 20,
    location: 'Corredor A',
    sellingPrice: 6.49,
    costPrice: 4.20,
    expiryDate: '2026-10-15',
    unit: 'un',
    soldCount: 250,
    revenue: 1622.50,
  },
  {
    id: '2',
    sku: 'AR-005',
    name: 'Arroz Semolina 5kg',
    category: 'Mercearia',
    currentStock: 0,
    minStock: 15,
    location: 'Corredor B',
    sellingPrice: 24.90,
    costPrice: 18.50,
    expiryDate: '2026-12-30',
    unit: 'un',
    soldCount: 198,
    revenue: 4930.20,
  },
  {
    id: '3',
    sku: 'CF-500',
    name: 'Café Torrado Especial 500g',
    category: 'Matinais',
    currentStock: 0,
    minStock: 10,
    location: 'Corredor A',
    sellingPrice: 18.90,
    costPrice: 12.00,
    expiryDate: '2026-11-20',
    unit: 'un',
    soldCount: 180,
    revenue: 3402.00,
  },
  {
    id: '4',
    sku: 'AZ-102',
    name: 'Açúcar Refinado Alto Brilho 1kg',
    category: 'Mercearia',
    currentStock: 142,
    minStock: 30,
    location: 'Corredor C',
    sellingPrice: 4.15,
    costPrice: 2.80,
    expiryDate: '2027-01-10',
    unit: 'un',
    soldCount: 150,
    revenue: 622.50,
  },
  {
    id: '5',
    sku: 'FL-088',
    name: 'Feijão Carioca Selecionado 1kg',
    category: 'Mercearia',
    currentStock: 8,
    minStock: 20,
    location: 'Corredor B',
    sellingPrice: 8.79,
    costPrice: 5.90,
    expiryDate: '2026-09-28',
    unit: 'un',
    soldCount: 120,
    revenue: 1054.80,
  },
  {
    id: '6',
    sku: 'OL-990',
    name: 'Óleo de Soja 900ml',
    category: 'Óleos & Temperos',
    currentStock: 210,
    minStock: 40,
    location: 'Corredor D',
    sellingPrice: 7.25,
    costPrice: 4.80,
    expiryDate: '2027-02-15',
    unit: 'un',
    soldCount: 95,
    revenue: 688.75,
  },
  {
    id: '7',
    sku: 'MC-400',
    name: 'Macarrão Espaguete Sêmola 500g',
    category: 'Massas',
    currentStock: 75,
    minStock: 25,
    location: 'Corredor C',
    sellingPrice: 3.89,
    costPrice: 2.40,
    expiryDate: '2026-11-05',
    unit: 'un',
    soldCount: 88,
    revenue: 342.32,
  },
];

export const sampleMovements: StockMovement[] = [
  {
    id: 'mov-1',
    productId: '1',
    productName: 'Leite Integral 1L',
    sku: 'LT-001',
    type: 'entry',
    quantity: 60,
    date: '2026-09-14 09:30',
    reason: 'Compra de fornecedor - NF 8492',
    user: 'Carlos Souza',
    batch: 'LT2026-09A',
  },
  {
    id: 'mov-2',
    productId: '5',
    productName: 'Feijão Carioca Selecionado 1kg',
    sku: 'FL-088',
    type: 'exit',
    quantity: 12,
    date: '2026-09-14 10:15',
    reason: 'Venda direta Balcão',
    user: 'Carlos Souza',
  },
];

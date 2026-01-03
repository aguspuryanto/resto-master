
import React from 'react';
import { Product, Table, TableStatus } from './types';

export const CATEGORIES = ['Food', 'Drinks', 'Dessert', 'Snacks'];

export const INITIAL_PRODUCTS: Product[] = [
  { id: '1', name: 'Nasi Goreng Spesial', price: 35000, category: 'Food', stock: 50, image: 'https://picsum.photos/seed/nasi/200/200' },
  { id: '2', name: 'Ayam Bakar Madu', price: 42000, category: 'Food', stock: 30, image: 'https://picsum.photos/seed/ayam/200/200' },
  { id: '3', name: 'Es Teh Manis', price: 8000, category: 'Drinks', stock: 100, image: 'https://picsum.photos/seed/tea/200/200' },
  { id: '4', name: 'Jus Alpukat', price: 18000, category: 'Drinks', stock: 20, image: 'https://picsum.photos/seed/avocado/200/200' },
  { id: '5', name: 'Brownies Lumer', price: 25000, category: 'Dessert', stock: 15, image: 'https://picsum.photos/seed/brownie/200/200' },
  { id: '6', name: 'Kentang Goreng', price: 15000, category: 'Snacks', stock: 40, image: 'https://picsum.photos/seed/fries/200/200' },
];

export const INITIAL_TABLES: Table[] = Array.from({ length: 12 }, (_, i) => ({
  id: `${i + 1}`,
  number: i + 1,
  capacity: i % 3 === 0 ? 4 : 2,
  status: TableStatus.AVAILABLE
}));

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
};

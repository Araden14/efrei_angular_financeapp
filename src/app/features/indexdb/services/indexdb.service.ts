import { Injectable } from '@angular/core';
import { Transaction } from '../models/transaction.model';
import { openDB, IDBPDatabase } from 'idb';

@Injectable({
  providedIn: 'root'
})
export class IndexedDBService {
  private dbPromise = openDB('FinanceAppDB', 1, {
    upgrade(db: IDBPDatabase) {
      // Object store for transactions
      if (!db.objectStoreNames.contains('transactions')) {
        const store = db.createObjectStore('transactions', {
          keyPath: 'id'
        });

        // Indexes for fast queries
        store.createIndex('by_userId', 'userId', { unique: false });
        store.createIndex('by_name', 'name', { unique: false });
        store.createIndex('by_type', 'type', { unique: false });
        store.createIndex('by_category', 'category.name', { unique: false });
        store.createIndex('by_date', 'date', { unique: false });
        store.createIndex('by_amount', 'amount', { unique: false });
      }
    }
  });

  private isInitialized = false;

  async init(): Promise<void> {
    if (!this.isInitialized) {
      await this.dbPromise;
      this.isInitialized = true;
      console.log('IndexedDB initialized');
    }
  }

  // Get all transactions
  async getAllTransactions(): Promise<Transaction[]> {
    const db = await this.dbPromise;
    return db.getAll('transactions');
  }

  // Get transaction by ID
  async getTransactionById(id: string): Promise<Transaction | undefined> {
    const db = await this.dbPromise;
    return db.get('transactions', id);
  }

  // Get transactions by user ID
  async getTransactionsByUserId(userId: number): Promise<Transaction[]> {
    const db = await this.dbPromise;
    return db.getAllFromIndex('transactions', 'by_userId', userId);
  }

  // Get transactions by type
  async getTransactionsByType(type: 'income' | 'expense'): Promise<Transaction[]> {
    const db = await this.dbPromise;
    return db.getAllFromIndex('transactions', 'by_type', type);
  }

  // Get transactions by category
  async getTransactionsByCategory(categoryName: string): Promise<Transaction[]> {
    const db = await this.dbPromise;
    return db.getAllFromIndex('transactions', 'by_category', categoryName);
  }

  // Add a new transaction
  async addTransaction(transaction: Transaction): Promise<string> {
    const db = await this.dbPromise;
    return db.add('transactions', transaction) as Promise<string>;
  }

  // Update a transaction
  async updateTransaction(transaction: Transaction): Promise<string> {
    const db = await this.dbPromise;
    return db.put('transactions', transaction) as Promise<string>;
  }

  // Delete a transaction
  async deleteTransaction(id: string): Promise<void> {
    const db = await this.dbPromise;
    return db.delete('transactions', id);
  }

  // Clear all transactions
  async clearAllTransactions(): Promise<void> {
    const db = await this.dbPromise;
    return db.clear('transactions');
  }
}
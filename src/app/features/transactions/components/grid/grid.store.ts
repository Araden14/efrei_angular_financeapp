// grid.store.ts
import { Injectable, signal } from '@angular/core';
import { Transaction } from '../../../indexdb/models/transaction.model';

@Injectable({ providedIn: 'root' })
export class GridStore {
  readonly rows = signal<Transaction[]>([]);
  set(rows: Transaction[]) { this.rows.set(rows); }
  add(rows: Transaction[]) { this.rows.update(curr => [...rows, ...curr]); }
}

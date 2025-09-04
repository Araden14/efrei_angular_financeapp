import { Component, inject } from '@angular/core';
import { IndexedDBService } from '../../../indexdb/services/indexdb.service';
import { CommonModule } from '@angular/common';
import { MatButton } from '@angular/material/button';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Transaction } from '../../../indexdb/models/transaction.model';
import { MatOption, MatSelect } from '@angular/material/select';
import { categories } from '../../../../data/categories';
import { MatIcon } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { generateId } from '../../../../utils/generateId';
import { Category } from '../../../../data/categories';
import { GridStore } from '../grid/grid.store';

@Component({
    selector: 'transactions-form',
    imports: [CommonModule, MatDatepickerModule, MatSelect, MatOption, MatIcon, MatButton, MatFormField, MatLabel, MatInputModule, ReactiveFormsModule],
    providers: [IndexedDBService],
    templateUrl:'./transactionform.component.html',
  })
  export class TransactionformComponent {
    constructor(private DBservice: IndexedDBService) {
    }
    private store = inject(GridStore);

    cats = categories
    AddTransaction = new FormGroup({
      category : new FormControl<Category>({name: 'Autre', icon: 'more_horiz'}, { nonNullable: true, validators: [Validators.required] }),
      amount: new FormControl<number>(0, { nonNullable: true, validators: [Validators.required]}),
      date: new FormControl<Date>(new Date(), { nonNullable: true, validators: [Validators.required] }),
      name: new FormControl<string>('Nom', { nonNullable: true, validators: [Validators.required] }),
      type: new FormControl<'income' | 'expense'>('expense', { nonNullable: true, validators: [Validators.required] }),
      frequency: new FormControl<'once' | 'monthly' | 'yearly' | 'weekly' | 'none'>('none', { nonNullable: true, validators: [Validators.required] }),
    })

    

    async onSubmit() {
        const category = this.AddTransaction.value.category
        const amount = this.AddTransaction.value.amount
        const date = this.AddTransaction.value.date
        const name = this.AddTransaction.value.name
        const type = this.AddTransaction.value.type
        const frequency = this.AddTransaction.value.frequency

        if (frequency && type && name && date && amount && category && category.name && category.icon){
        const transaction: Transaction = {
            id : generateId(),
            type : type,
            name : name,
            category: category,
            amount : amount,
            date : date,
            userId : 1,
            frequency: frequency,
            createdAt: new Date(),
            updatedAt: new Date()
        }
        this.DBservice.addTransaction(transaction)
        this.store.add([transaction])
        console.log("new transaction", transaction)
        
    }
        else{
            console.error("Invalid form data")
        }
    }
}
  
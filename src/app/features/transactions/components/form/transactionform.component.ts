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
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CategoryService } from '../../../../shared/services/category.service';

@Component({
    selector: 'transactions-form',
    imports: [CommonModule, MatDatepickerModule, MatSelect, MatOption, MatIcon, MatButton, MatFormField, MatLabel, MatInputModule, ReactiveFormsModule, MatSnackBarModule],
    providers: [IndexedDBService],
    templateUrl:'./transactionform.component.html',
  })
  export class TransactionformComponent {
    constructor(private DBservice: IndexedDBService, private snackBar: MatSnackBar) {
    }
    private store = inject(GridStore);
    private categories = inject(CategoryService)
    categoriesSignal = this.categories.categories;


    cats = categories
    AddTransaction = new FormGroup({
      category : new FormControl<Category>({name: "", icon: 'more_horiz'}, { nonNullable: true, validators: [Validators.required] }),
      amount: new FormControl<number>(0, { nonNullable: true, validators: [Validators.required]}),
      date: new FormControl<Date>(new Date(), { nonNullable: true, validators: [Validators.required] }),
      name: new FormControl<string>('Nom', { nonNullable: true, validators: [Validators.required] }),
      type: new FormControl<'income' | 'expense'>('expense', { nonNullable: true, validators: [Validators.required] }),
      frequency: new FormControl<'once' | 'monthly' | 'yearly' | 'weekly' | 'none'>('none', { nonNullable: true, validators: [Validators.required] }),
    })

    

    async onSubmit() {
        // Check if form is valid first
        if (this.AddTransaction.invalid) {
            this.showValidationErrors();
            return;
        }
    
        const formValue = this.AddTransaction.value;
        const category = formValue.category;
        const amount = formValue.amount;
        const date = formValue.date;
        const name = formValue.name;
        const type = formValue.type;
        const frequency = formValue.frequency;
    
        // More specific validation
        const errors: string[] = [];
        
        if (!name || name.trim() === '') {
            errors.push('Name is required');
        }
        if (!category || !category.name) {
            errors.push('Category is required');
        }
        if (!amount || amount <= 0) {
            errors.push('Amount must be greater than 0');
        }
        if (!date) {
            errors.push('Date is required');
        }
        if (!type) {
            errors.push('Transaction type is required');
        }
        if (!frequency) {
            errors.push('Frequency is required');
        }
    
        if (errors.length > 0) {
            this.showSpecificErrors(errors);
            return;
        }
    
        try {
            const transaction: Transaction = {
                id : generateId(),
                type : type!,
                name : name!.trim(),
                category: category!,
                amount : amount!,
                date : date!,
                userId : 1,
                frequency: frequency!,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            
            await this.DBservice.addTransaction(transaction);
            this.store.add([transaction]);
            console.log("New transaction created:", transaction);
            
            // Reset form after successful submission
            this.AddTransaction.reset();
            
            this.snackBar.open("Transaction added successfully!", "Close", {
                duration: 3000,
                panelClass: ['success-snackbar']
            });
        } catch (error) {
            console.error("Error creating transaction:", error);
            this.snackBar.open("Failed to save transaction. Please try again.", "Close", {
                duration: 5000,
                panelClass: ['error-snackbar']
            });
        }
    }
    
    private showValidationErrors() {
        const controls = this.AddTransaction.controls;
        const errors: string[] = [];
    
        if (controls.name.errors?.['required']) {
            errors.push('Name is required');
        }
        if (controls.category.errors?.['required']) {
            errors.push('Category must be selected');
        }
        if (controls.amount.errors?.['required']) {
            errors.push('Amount is required');
        }
        if (controls.date.errors?.['required']) {
            errors.push('Date is required');
        }
        if (controls.type.errors?.['required']) {
            errors.push('Transaction type must be selected');
        }
        if (controls.frequency.errors?.['required']) {
            errors.push('Frequency must be selected');
        }
    
        this.showSpecificErrors(errors);
    }
    
    private showSpecificErrors(errors: string[]) {
        const errorMessage = errors.join('\n• ');
        this.snackBar.open(`Please fix the following errors:\n• ${errorMessage}`, "Close", {
            duration: 5000,
            panelClass: ['error-snackbar']
        });
    }
}
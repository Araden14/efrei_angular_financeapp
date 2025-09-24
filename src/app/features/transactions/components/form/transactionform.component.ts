import { Component, inject, signal, ViewChild, ElementRef } from '@angular/core';
import { IndexedDBService } from '../../../indexdb/services/indexdb.service';
import { CommonModule } from '@angular/common';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { Transaction } from '../../../indexdb/models/transaction.model';
import { categories } from '../../../../data/categories';
import { generateId } from '../../../../utils/generateId';
import { Category } from '../../../../data/categories';
import { GridStore } from '../grid/grid.store';
import { CategoryService } from '../../../../shared/services/category.service';
import { MessageService } from 'primeng/api';
import { InputText } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';
import { Select } from 'primeng/select';
import { DatePicker } from 'primeng/datepicker';
import { Button } from 'primeng/button';
import { FloatLabel } from 'primeng/floatlabel';
import { ProgressBar } from 'primeng/progressbar';
import { AnimateDirective } from '../../../../shared/directives/animate.directive';

@Component({
    selector: 'transactions-form',
    imports: [CommonModule, InputText, Textarea, Select, DatePicker, Button, FloatLabel, ReactiveFormsModule, ProgressBar, AnimateDirective],
    providers: [IndexedDBService],
    templateUrl:'./transactionform.component.html',
  })
  export class TransactionformComponent {
    @ViewChild('submitButton', { read: AnimateDirective }) submitButtonAnimator!: AnimateDirective;
    
    constructor(private DBservice: IndexedDBService, private messageService: MessageService) {
    }
    private store = inject(GridStore);
    private categories = inject(CategoryService)
    categoriesSignal = this.categories.categories;
    
    // Loading state for progress bar
    isLoading = signal<boolean>(false);


    cats = categories
    AddTransaction = new FormGroup({
      category : new FormControl<Category>({name: "", icon: 'more_horiz'}, { nonNullable: true, validators: [Validators.required] }),
      amount: new FormControl<number>(0, { nonNullable: true, validators: [Validators.required, Validators.min(0.01)]}),
      date: new FormControl<Date>(new Date(), { nonNullable: true, validators: [Validators.required] }),
      name: new FormControl<string>('', {nonNullable: true, validators: [Validators.required] }),
      type: new FormControl<'income' | 'expense'>('expense', { nonNullable: true, validators: [Validators.required] }),
    })

    

    async onSubmit() {
        // Check if form is valid first
        if (this.AddTransaction.invalid) {
            this.showValidationErrors();
            // Trigger validation error animation
            if (this.submitButtonAnimator) {
                this.submitButtonAnimator.triggerAnimation('shake');
            }
            return;
        }
    
        // Prevent multiple submissions while loading
        if (this.isLoading()) {
            return;
        }

        const formValue = this.AddTransaction.value;
        const category = formValue.category;
        const amount = formValue.amount;
        const date = formValue.date;
        const name = formValue.name;
        const type = formValue.type;
    
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
    
        if (errors.length > 0) {
            this.showSpecificErrors(errors);
            // Trigger validation error animation
            if (this.submitButtonAnimator) {
                this.submitButtonAnimator.triggerAnimation('shake');
            }
            return;
        }

        // Start loading
        this.isLoading.set(true);
    
        try {
            const transaction: Transaction = {
                id : generateId(),
                type : type!,
                name : name!.trim(),
                category: category!,
                amount : amount!,
                date : date!,
                userId : 1,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            
            // Simulate API request delay
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            await this.DBservice.addTransaction(transaction);
            this.store.add([transaction]);

            // Reset form after successful submission
            this.AddTransaction.reset({
                category: {name: "", icon: 'more_horiz'},
                amount: 0,
                date: new Date(),
                name: '',
                type: 'expense'
            });

            this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Transaction ajoutée avec succès'
            });
            
            // Trigger success animation
            if (this.submitButtonAnimator) {
                this.submitButtonAnimator.triggerAnimation('bounce');
            }
        } catch (error) {
            console.error("Error creating transaction:", error);
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: "Echec lors de l'ajout de la transaction"
            });
            
            // Trigger error animation
            if (this.submitButtonAnimator) {
                this.submitButtonAnimator.triggerAnimation('shake');
            }
        } finally {
            // Stop loading
            this.isLoading.set(false);
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
        if (controls.amount.errors?.['min']) {
            errors.push('Amount must be greater than 0');
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
    
        this.showSpecificErrors(errors);
    }
    
    private showSpecificErrors(errors: string[]) {
        const errorMessage = errors.join(', ');
        this.messageService.add({
            severity: 'error',
            summary: 'Validation Error',
            detail: `Please fix the following errors: ${errorMessage}`
        });
    }
}
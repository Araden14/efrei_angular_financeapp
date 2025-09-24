import {FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import { Component, signal} from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../models/user.model';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { InputText } from 'primeng/inputtext';
import { Button } from 'primeng/button';
import { FloatLabel } from 'primeng/floatlabel';
import { Toast } from 'primeng/toast';

@Component({
  selector: 'login',
  standalone: true,
  templateUrl: './login.html',
  imports: [ReactiveFormsModule, InputText, Button, FloatLabel, Toast],
})
export class LoginComponent {
  email = new FormControl('',[Validators.required, Validators.email])
  password = new FormControl('',[Validators.required, Validators.minLength(8)]);
  constructor(private authService: AuthService, private router: Router, private messageService: MessageService) {}

  async onSubmit() {
    // Mark fields as touched to trigger validation display
    this.email.markAsTouched();
    this.password.markAsTouched();

    // Check email validation
    if (this.email.invalid) {
      if (this.email.errors?.['required']) {
        this.messageService.add({
          severity: 'error',
          summary: 'Email required',
          detail: 'Please enter your email'
        });
        return;
      }
      if (this.email.errors?.['email']) {
        this.messageService.add({
          severity: 'error',
          summary: 'Email invalid',
          detail: 'Please enter a valid email'
        });
        return;
      }
    }

    // Check password validation
    if (this.password.invalid) {
      if (this.password.errors?.['required']) {
        this.messageService.add({
          severity: 'error',
          summary: 'Password required',
          detail: 'Please enter your password'
        });
        return;
      }
      if (this.password.errors?.['minlength']) {
        this.messageService.add({
          severity: 'error',
          summary: 'Password too short',
          detail: 'The password must contain at least 8 characters'
        });
        return;
      }
    }

    // If validation passes, proceed with login
    if (this.email.valid && this.password.valid && this.email.value && this.password.value) {
      const loginRequest: LoginRequest = {
        email: this.email.value,
        password: this.password.value
      }
      try {
        const result = await this.authService.login(loginRequest);
        if (result.success) {
          console.log('Login successful:', result.user);
          this.messageService.add({
            severity: 'success',
            summary: 'Connection successful',
            detail: 'You are now connected'
          });
          this.router.navigate(['']);
        } else {
          console.error('Login failed:', result.error);
          this.messageService.add({
            severity: 'error',
            summary: 'Connection failed',
            detail: 'Email or password incorrect'
          });
        }
      } catch (error) {
        console.error('Login error:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'An error occurred while connecting'
        });
      }
    }
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }
}
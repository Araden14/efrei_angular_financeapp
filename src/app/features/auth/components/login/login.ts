import {FormControl, ReactiveFormsModule} from '@angular/forms';
import { Component, signal} from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../models/user.model';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { InputText } from 'primeng/inputtext';
import { Password } from 'primeng/password';
import { Button } from 'primeng/button';
import { FloatLabel } from 'primeng/floatlabel';

@Component({
  selector: 'login',
  standalone:true,
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  imports: [ReactiveFormsModule, InputText, Password, Button, FloatLabel],
})
export class LoginComponent {
  email = new FormControl('')
  password = new FormControl('');
  constructor(private authService: AuthService, private router: Router, private messageService: MessageService) {}

  async onSubmit() {
    if (this.email.value && this.password.value) {
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
          summary: 'Success',
          detail: 'Login successful'
        });
        this.router.navigate(['']);
      } else {
        console.error('Login failed:', result.error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Login failed'
        });
      }
    } catch (error) {
      console.error('Login error:', error);
    }
    }
  }
}
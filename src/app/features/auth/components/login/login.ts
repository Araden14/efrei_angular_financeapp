import {FormControl, ReactiveFormsModule} from '@angular/forms';
import { Component, signal} from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';  
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../models/user.model';
import { Router, RouterLink } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'login',
  standalone:true,
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  imports: [ReactiveFormsModule, RouterLink , MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule,MatSnackBarModule],
})
export class LoginComponent {
  email = new FormControl('')
  password = new FormControl('');
  hide = signal(true);

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }
  constructor(private authService: AuthService, private router: Router, private snackBar: MatSnackBar) {}

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
        this.snackBar.open("Login successful", "Close", {
          duration: 3000,
          panelClass: ['success-snackbar']
        })
        this.router.navigate(['']);
      } else {
        console.error('Login failed:', result.error);
        this.snackBar.open("Login failed", "Close", {
          duration: 3000,
          panelClass: ['error-snackbar']
        })
      }
    } catch (error) {
      console.error('Login error:', error);
    }
    }
  }
}
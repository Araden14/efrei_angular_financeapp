import {EmailValidator, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { passwordMatchValidator } from '../../../../shared/validators/passwordValidator';
import { InputText } from 'primeng/inputtext';
import { Password } from 'primeng/password';
import { Button } from 'primeng/button';
import { FloatLabel } from 'primeng/floatlabel';
import { Message } from 'primeng/message';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { Router } from '@angular/router';
@Component({
  selector: 'register',
  templateUrl: './register.component.html',
  standalone:true,
  imports: [ReactiveFormsModule, InputText, Password, Button, FloatLabel, Message, Toast],
  providers: [MessageService, AuthService]
})
export class RegisterComponent {
    constructor(private messageService : MessageService, private authService : AuthService, private router : Router) {}
    register = new FormGroup({
        name: new FormControl('',[Validators.required]),
        email: new FormControl('',[Validators.required, Validators.email]),
        password: new FormControl('',[Validators.required, Validators.minLength(8)]),
        confirmpassword : new FormControl('',[Validators.required, Validators.minLength(8)]),
    }, { validators: [passwordMatchValidator('password', 'confirmpassword')] });


    onSubmit() {
        if(this.register.valid){
            this.authService.register(
                {
                    name: this.register.get("name")?.value || '',
                    email: this.register.get("email")?.value || '',
                    password: this.register.get("password")?.value || '',
                    confirmPassword: this.register.get("confirmpassword")?.value || '',
                }
            ).then((result) => {
                if (result.success){
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Inscription réussie!'
                    });
                    this.router.navigate(['']);
                }
            })
        } else {
            let error_msgs = []
            if (this.register.get("email")?.errors){
                error_msgs.push("L'email est incorrect")
            }
            if (this.register.get("name")?.value == '' || this.register.get("email")?.value == '' || this.register.get("password")?.value == '' || this.register.get("confirmpassword")?.value == ''){
                error_msgs.push("Veuillez vérifier si tous les champs sont remplis")
            }
            if (this.register.errors){
                error_msgs.push("Les deux mots de passe ne correspondent pas")
            }
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: `${error_msgs.join('\n')}`
            });
        }
    }
      
}   
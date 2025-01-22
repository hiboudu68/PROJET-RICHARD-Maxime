import { ApiService } from '../api.service';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm = new FormGroup({
    firstnameControl: new FormControl(''),
    lastnameControl: new FormControl(''),
    emailControl: new FormControl(''),
    loginControl: new FormControl(''),
    passwordControl: new FormControl(''),
    confirmPasswordControl: new FormControl('')
  });
  alreadySubmitted: boolean = false;
  errorMessage: string = '';
  showSuccessMessage: boolean = false;

  constructor(private apiService: ApiService) {}

  protected getErrors(name: string) : string {
    return this.validateTitleControl(this.getControlName(this.registerForm, name), this.alreadySubmitted);
  };

  onSubmit() {
    this.errorMessage = '';
    this.alreadySubmitted = true;
    const { firstnameControl, lastnameControl, emailControl, loginControl, passwordControl, confirmPasswordControl } = this.registerForm.value;

    if(passwordControl != confirmPasswordControl) {
      this.errorMessage = 'Les mots de passe ne correspondent pas';
      return;
    }

    if (!this.registerForm.valid) {
      this.errorMessage = 'Veuillez remplir correctement tous les champs.';
      return;
    }

    if (firstnameControl && lastnameControl && emailControl && loginControl && passwordControl) {
      const user = {
        firstname: firstnameControl,
        lastname: lastnameControl,
        email: emailControl,
        login: loginControl,
        password: passwordControl,
      }
  
      this.apiService.registerUser(user).subscribe(
        (res) => {
          this.showSuccessMessage = true;
        },
        (err) => {
          this.errorMessage = err.error;
          console.error(err);
        }
      );
    }
  }

  validateTitleControl(titleControl: FormControl, alreadySubmitted: boolean): string {
    if(titleControl.errors?.['passwordsMismatch']) {
      return 'Les mots de passe ne correspondent pas';
    }

    if (titleControl.errors && (titleControl?.touched  || alreadySubmitted)) {
      if (titleControl.errors?.['required']) {
        return 'Le champ est obligatoire';
      }

      if (titleControl.errors?.['minlength']) {
        return `Le champ doit contenir au moins ${titleControl.errors['minlength'].requiredLength} caractères`;
      }
      if (titleControl.errors?.['maxlength']) {
        return `Le champ doit contenir au plus ${titleControl.errors['maxlength'].requiredLength} caractères`;
      }

      if(titleControl.errors?.['email']) {
        return 'Le champ doit être une adresse email valide';
      }

      if (titleControl.errors?.['pattern']) {
        return 'Le champ ne respecte pas le format attendu';
      }

      return 'Erreur non répertoriée';
    }
    return '';
  }

  getControlName(formGroup: FormGroup, name: string): FormControl {
    return formGroup.get(name) as FormControl;
  }
}

import { ApiService } from '../api.service';
import { Component, OnInit } from '@angular/core';
import { Client } from '../models/Client';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [ ReactiveFormsModule, CommonModule, RouterModule],
  providers: [ApiService],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent implements OnInit {
  user: Observable<Client> | undefined;
  userForm = new FormGroup({
    firstnameControl: new FormControl(''),
    lastnameControl: new FormControl(''),
    emailControl: new FormControl(''),
    loginControl: new FormControl(''),
    passwordControl: new FormControl(''),
    confirmPasswordControl: new FormControl('')
  });
  errorMessage: string = '';
  alreadySubmitted: boolean = false;
  showSuccessMessage: boolean = false;

  constructor(private fb : FormBuilder, private apiService: ApiService, private router: Router) {}

  async ngOnInit(): Promise<void> {
    if (localStorage.getItem('token') === null) {
      localStorage.setItem('errorMessage', 'Vous devez être connecté pour accéder à cette page');
      this.router.navigate(['/login']);
    }

    this.userForm = this.fb.group({
      firstnameControl: ['', [Validators.required, Validators.maxLength(50), Validators.pattern(/^[a-zA-ZÀ-ÿ\s]*$/)]],
      lastnameControl: ['', [Validators.required, Validators.maxLength(50), Validators.pattern(/^[a-zA-ZÀ-ÿ\s]*$/)]],
      emailControl: ['', [Validators.required, Validators.email]],
      loginControl: ['', [Validators.required, Validators.maxLength(50), Validators.pattern(/^[a-zA-ZÀ-ÿ\s]*$/)]],
      passwordControl: ['', [Validators.required]],
      confirmPasswordControl: ['', [Validators.required, this.passwordMatchValidator.bind(this)]]
    });

    this.user = this.apiService.getUser();
    
    this.user.subscribe(user => {
      this.userForm.patchValue({
        firstnameControl: user.firstname,
        lastnameControl: user.lastname,
        emailControl: user.email,
        loginControl: user.login,
        passwordControl: user.password,
        confirmPasswordControl: user.password
      });
    });
  }

  private passwordMatchValidator(control: FormControl): ValidationErrors | null {
      const password = this.userForm?.get('passwordControl')?.value;
      const confirmPassword = control.value;
      return password === confirmPassword ? null : { passwordsMismatch: true };
    }

  protected getErrors(name: string) : string {
    return this.validateTitleControl(this.getControlName(this.userForm, name), this.alreadySubmitted);
  };

  onSubmit() {
    this.errorMessage = '';
    this.alreadySubmitted = true;
    const { firstnameControl, lastnameControl, emailControl, loginControl, passwordControl, confirmPasswordControl } = this.userForm.value;

    if(passwordControl != confirmPasswordControl) {
      this.errorMessage = 'Les mots de passe ne correspondent pas';
      return;
    }

    if (!this.userForm.valid) {
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
  
      this.apiService.updateUser(user).subscribe(
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

  onDisconnect() {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
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

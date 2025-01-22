import { Routes } from '@angular/router';
import { WelcomeComponent } from './welcome/welcome.component';
import { LoginComponent } from './login/login.component';
import { ListeComponent } from './liste/liste.component';
import { CartComponent } from './cart/cart.component';
import { AccountComponent } from './account/account.component';
import { CreditCardComponent } from './credit-card/credit-card.component';
import { RegisterComponent } from './register/register.component';

export const routes: Routes = [
    {path: '', component: WelcomeComponent},
    {path: 'login', component: LoginComponent},
    {path: 'liste', component: ListeComponent},
    {path: 'cart', component: CartComponent},
    {path: 'credit-cards', component: CreditCardComponent},
    {path: 'account', component: AccountComponent},
    {path: 'register', component: RegisterComponent}
];
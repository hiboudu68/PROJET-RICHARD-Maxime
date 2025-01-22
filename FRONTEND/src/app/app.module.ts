import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgxsModule } from '@ngxs/store';
import { routes } from './app.routes';
import { ApiService } from './api.service';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { CartState } from './cart/cart.state';
import { ListeComponent } from "./liste/liste.component";
import { SideBarComponent } from './side-bar/side-bar.component';
import { TokenInterceptor } from './token.interceptor';
import { CommonModule } from '@angular/common';
import { CartComponent } from './cart/cart.component';


@NgModule({
  declarations: [
    AppComponent,
    CartComponent,
    HeaderComponent
  ],
  imports: [
    SideBarComponent,
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    NgxsModule.forRoot([CartState]),
    ListeComponent,
    CommonModule
],
  providers: [
    ApiService, 
    {
        provide: HTTP_INTERCEPTORS,
        useClass: TokenInterceptor,
        multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
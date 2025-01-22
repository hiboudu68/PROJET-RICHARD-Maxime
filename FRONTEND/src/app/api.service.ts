import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, map, Observable, pipe } from 'rxjs';
import { Produit } from './models/Produit';
import { environment } from '../environements/environement';
import { loginResponse } from './login/loginResponse';
import { Client } from './models/Client';
import { Card } from './models/Card';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http:HttpClient) { }

  public loginClient(login: string, password: string): Observable<loginResponse> {
    let data: String;
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
      }),
    };
    data = 'login=' + login + '&password=' + password;
    return this.http.post<loginResponse>(
      environment.backendUserLogin,
      data,
      httpOptions
    );
  }

  public getUser(): Observable<Client> {
    return this.http.get<Client>(environment.backendUserByToken);
  }

  public updateUser(client: Client): Observable<Client> {
    let data: String;
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
      }),
    };
    data = 'token=' + localStorage.getItem('token') + '&firstname=' + client.firstname + '&lastname=' + client.lastname + '&email=' + client.email + '&login=' + client.login + '&password=' + client.password;
    return this.http.put<Client>(environment.backendUserByToken, data, httpOptions);
  }

  public registerUser(client: Client): Observable<Client> {
    let data: String;
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
      }),
    };
    data = 'lastname=' + client.lastname + '&firstname=' + client.firstname + '&email=' + client.email + '&login=' + client.login + '&password=' + client.password;
    return this.http.post<Client>(
      environment.backendUserRegister,
      data,
      httpOptions
    );
  }

  private produitSubject: BehaviorSubject<Produit[]> = new BehaviorSubject<Produit[]>([]);
  public produits$: Observable<Produit[]> = this.produitSubject.asObservable();

  public getProduits(name : string = "", type : string = "", price : number = 0) : Observable<Produit[]> {
    return this.http.get<Produit[]>(environment.backendProduit).pipe(
      map((produits: Produit[]) => {
        return produits.filter(produit => {
          const matchesName = name ? produit.nom && this.normalize(produit.nom).includes(this.normalize(name)) : true;
          const matchesType = type ? produit.type && this.normalize(produit.type).includes(this.normalize(type)) : true;
          const matchesPrice = Number.isNaN(price) || price ? produit.prix !== undefined && produit.prix >= price : true;
          return matchesName || matchesType || matchesPrice;
        });
      }),
      map((filteredProduits: Produit[]) => {
        this.produitSubject.next(filteredProduits);
        return filteredProduits;
      })
    );
  }

  public getProduitsIndividual(name : string = "", type : string = "", price : number = 0) : Observable<Produit[]> {
    return this.http.get<Produit[]>(environment.backendProduit).pipe(
      map((produits: Produit[]) => {
        return produits.filter(produit => {
          const matchesName = name ? name !== "" && produit.nom && this.normalize(produit.nom).includes(this.normalize(name)) : true;
          return matchesName;
        });
      }),
      map((produits: Produit[]) => {
        return produits.filter(produit => {
          const matchesType = type ? type !== "" && produit.type && this.normalize(produit.type).includes(this.normalize(type)) : true;
          return matchesType;
        });
      }),
      map((produits: Produit[]) => {
        return produits.filter(produit => {
          const matchesPrice = price ? produit.prix !== undefined && produit.prix >= price : true;
          return matchesPrice;
        });
      }),
      map((filteredProduits: Produit[]) => {
        this.produitSubject.next(filteredProduits);
        return filteredProduits;
      })
    );
  }

  public getCards() : Observable<Card[]> {
    return this.http.get<Card[]>(environment.backendCard);
  }

  public addCard(creditCard: Card){
    let data: String;
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
      }),
    };
    data = 'name=' + creditCard.name + '&code=' + creditCard.code + '&ccv=' + creditCard.ccv + '&date=' + creditCard.date;
    return this.http.post<Card>(  
      environment.backendCard,
      data,
      httpOptions
    );
  }

  public removeCard(index: number) {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
      }),
    };
    return this.http.delete<Card>(environment.backendCard + '/' + index, httpOptions);
  }

  public updateCard(card: Card) {
    let data: String;
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
      }),
    };
    data = 'token=' + localStorage.getItem('token') + '&name=' + card.name + '&code=' + card.code + '&ccv=' + card.ccv + '&date=' + card.date + '&idUser=' + card.idUser+ '&id=' + card.id;
    return this.http.put<Client>(environment.backendCard, data, httpOptions);
  }

  private normalize(str: string) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  }  
}
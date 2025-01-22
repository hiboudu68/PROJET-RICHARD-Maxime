import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { CartState } from './cart.state';
import { DelProduct } from './cart.actions';
import { ProduitInCart } from '../models/ProduitInCart';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit{
  cartProducts: ProduitInCart[] = [];

  constructor(private store: Store) {}

  ngOnInit() {
    this.store.select(CartState.getCartProducts).subscribe(produits => {
      this.cartProducts = produits;
    });
  }

  removeFromCart(product: ProduitInCart) {
    this.store.dispatch(new DelProduct(product));
  }
}

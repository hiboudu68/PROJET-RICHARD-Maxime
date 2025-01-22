import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { AddProduct, DelProduct } from './cart.actions';
import { CartStateListModel } from './card-state-list';
import { ProduitInCart } from '../models/ProduitInCart';

@State<CartStateListModel>({
  name: 'cart',
  defaults: {
    produits: []
  }
})
@Injectable()
export class CartState {
  @Selector()
  static getCartProducts(state: CartStateListModel) {
    return state.produits;
  }

  @Selector()
  static getCartCount(state: CartStateListModel) {
    return state ? state.produits.length : 0;
  }

  @Action(AddProduct)
  add({ getState, patchState }: StateContext<CartStateListModel>, { payload }: AddProduct) {
    const state = getState();
    patchState({produits: [...state.produits, new ProduitInCart(state.produits[state.produits.length - 1]?.id, payload)]});
  }

  @Action(DelProduct)
  del({ getState, patchState }: StateContext<CartStateListModel>, { payload }: DelProduct) {
    const state = getState();
    patchState({produits: state.produits.filter(el => el.id !== payload.id)});
  }
}
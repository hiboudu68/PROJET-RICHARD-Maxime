import { Produit } from '../models/Produit';
import { ProduitInCart } from '../models/ProduitInCart';

export class AddProduct {
  static readonly type = '[Cart] Add Produit';

  constructor(public payload: Produit) {}
}

export class DelProduct {
  static readonly type = '[Cart] Del Produit';

  constructor(public payload: ProduitInCart) {}
}
import { Produit } from "./Produit";

export class ProduitInCart {
    id : number | undefined;
    produit : Produit | undefined;

    constructor(id : number | undefined, prod : Produit) {
        this.produit = prod
        if (id === undefined || id === null) {
            id = 0;
        }
        this.id = id + 1
    }
}
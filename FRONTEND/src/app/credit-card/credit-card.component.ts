import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Card } from '../models/Card';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormCardComponent } from "../form-card/form-card.component";
import { Produit } from '../models/Produit';
import { ProduitInCart } from '../models/ProduitInCart';

@Component({
  selector: 'app-credit-card',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, FormCardComponent],
  templateUrl: './credit-card.component.html',
  styleUrl: './credit-card.component.css'
})
export class CreditCardComponent {
  cards: Card[] | undefined;
  constructor(private apiservice: ApiService) {}

  ngOnInit(): void {
    this.apiservice.getCards().subscribe(Items => {
      this.cards = Items;
    });
  }

  removeCard(index: number | undefined) {
    if (index) {
      this.apiservice.removeCard(index).subscribe(
        (res) => {
          if (this.cards){
            this.cards = this.cards.filter((cards) => cards.id !== index);
          }
        },
        (err) => {
          console.error(err);
        }
      )
    }
  }

  editId: number | undefined;
  update = new FormGroup({
    nameUpdate : new FormControl('', Validators.required),
    codeUpdate : new FormControl('', [Validators.pattern("([0-9]{4\.){3}([0-9]{4})"),Validators.required]),
    ccvUpdate : new FormControl(0, Validators.max(999)),
    dateUpdate : new FormControl('', Validators.required),
  })
  
  editCard(card: Card | undefined) {
    if(card){
      this.editId = card.id;
      let code = "";
      card.code?.forEach(el => {
        code += el;
      })
      let date = "";
      card.date?.forEach(el => {
        code += el;
      })
      this.update.patchValue({
        nameUpdate: card.name,
        codeUpdate: code,
        ccvUpdate: card.ccv,
        dateUpdate: date,
      });
    }
  }

  saveEdit(id: number | undefined) {
    if(id) {
      this.apiservice.updateCard({
        id: id, 
        name : this.update.controls.nameUpdate.value ? this.update.controls.nameUpdate.value : undefined,
        code : this.update.controls.codeUpdate.value?.split('.'),
        ccv : this.update.controls.ccvUpdate.value ? this.update.controls.ccvUpdate.value : undefined,
        date : this.update.controls.dateUpdate.value?.split('/'),
        idUser: 0
      }).subscribe(
        (res) => {
          if (this.cards){
            this.cards = this.cards.filter((cards) => cards.id !== id);
          }
        },
        (err) => {
          console.error(err);
        }
      )
    }
    this.editId = undefined;
  }

  cancelEdit() {
    this.editId = undefined;
  }

  restrict_inputchar(event: any) {
    var k;  
    k = event.charCode;
    return k >= 46 && k <= 57;
  }
}

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Card } from '../models/Card';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormCardComponent } from "../form-card/form-card.component";
import { Produit } from '../models/Produit';
import { ProduitInCart } from '../models/ProduitInCart';
import { Router } from '@angular/router';

@Component({
  selector: 'app-credit-card',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, FormCardComponent],
  templateUrl: './credit-card.component.html',
  styleUrl: './credit-card.component.css'
})
export class CreditCardComponent {
  cards: Card[] | undefined;
  constructor(private apiservice: ApiService, private router: Router) {}

  ngOnInit(): void {
    if (localStorage.getItem('token') === null) {
      localStorage.setItem('errorMessage', 'Vous devez être connecté pour accéder à cette page');
      this.router.navigate(['/login']);
    }

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
  
  editCard(id: number = 0, name: string = "", code: string= "", ccv: number= 0, date: string= "") {
    this.editId = id;
    
    this.update.patchValue({
      nameUpdate: name,
      codeUpdate: code,
      ccvUpdate: ccv,
      dateUpdate: date,
    });
  }

  async saveEdit(id: number | undefined) {
    if(id) {
      await this.apiservice.updateCard({
        id: id, 
        name : this.update.controls.nameUpdate.value ? this.update.controls.nameUpdate.value : undefined,
        code : this.update.controls.codeUpdate.value ? this.update.controls.codeUpdate.value : undefined,
        ccv : this.update.controls.ccvUpdate.value ? this.update.controls.ccvUpdate.value : undefined,
        date : this.update.controls.dateUpdate.value ? this.update.controls.dateUpdate.value : undefined,
        idUser: 0
      }).subscribe(
        (res) => {
        },
        (err) => {
          console.error(err)
        }
      )
      window.location.reload()
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

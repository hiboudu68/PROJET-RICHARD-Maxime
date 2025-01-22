import { Component, Output, EventEmitter, OnInit, Input } from '@angular/core';
import { CartState } from '../cart/cart.state';
import { Store } from '@ngxs/store';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  nbInCart: number = 0;
  title = 'Project_';
  buttonMenu :string = ">";
  
  @Output() clickSideBar = new EventEmitter<void>();

  constructor(private store: Store) {}


  onClickSideBar() {
    this.clickSideBar.emit();
  }

  ngOnInit() {
    this.store.select(CartState.getCartCount).subscribe(count => {
      this.nbInCart = count;
    });
  }
}

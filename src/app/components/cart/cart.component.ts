import { Component } from '@angular/core';

@Component({
  selector: 'cart',
  standalone: true,
  imports: [],
  templateUrl: './cart.component.html'
})
export class CartComponent {
  items: number = 0;
  total: number = 0;
  subtotal: number = 149990;
  cantidad: number = 0;

  decrease(){
    if(this.cantidad > 0){
      this.cantidad --;
    }
  }
  increase(){
    this.cantidad ++;
  }

}

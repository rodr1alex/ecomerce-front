import { Component, Input, OnInit } from '@angular/core';
import { Cart } from '../../models/cart.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { OrderedProduct } from '../../models/ordered-product.model';
import { state } from '@angular/animations';
import { SharingDataService } from '../../services/sharing-data.service';

@Component({
  selector: 'cart',
  standalone: true,
  imports: [],
  templateUrl: './cart.component.html'
})
export class CartComponent implements OnInit{
  cartIN!: Cart;
  cantidad: number = 0;
  cart!: Cart;


  constructor(  private route: ActivatedRoute,
                private router: Router,
                private sharingDataServie: SharingDataService,
                private cartStore: Store<{carts: any}>,){
                  this.cartStore.select('carts').subscribe(state =>{                   
                    if (state.cart && Array.isArray(state.cart.orderedProductList)) {
                      this.cart = { 
                        ...state.cart, 
                        orderedProductList: [...state.cart.orderedProductList] 
                      };
                    } else {
                      // Inicializar orderedProductList si no es un array
                      this.cart = { 
                        ...state.cart, 
                        orderedProductList: [] 
                      };
                    }
                  })
                }

  ngOnInit(): void {

  }

  decrease(orderedProduct: OrderedProduct){
    if(orderedProduct.quantity > 0){
      this.sharingDataServie.modifyProductQuantityCartEventEmitter.emit({diferential: -1, orderedProduct});
    }
  }
  increase(orderedProduct: OrderedProduct){
    this.sharingDataServie.modifyProductQuantityCartEventEmitter.emit({diferential: 1, orderedProduct});
  }
  remove(orderedProduct: OrderedProduct){
    this.sharingDataServie.removeProductCartEventEmitter.emit(orderedProduct);
  }
  cleanCart(){
    this.sharingDataServie.cleanCartEventEmitter.emit();
  }

}


// let cartUpdated = {
//   ...this.cart,
//   orderedProductList: [...this.cart.orderedProductList] // Clonar shallow copy del array orderedProductList
// };
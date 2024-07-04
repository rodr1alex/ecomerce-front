import { Component, Input, OnInit } from '@angular/core';
import { Cart } from '../../models/cart.model';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { OrderedProduct } from '../../models/ordered-product.model';
import { state } from '@angular/animations';
import { SharingDataService } from '../../services/sharing-data.service';

@Component({
  selector: 'cart',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './cart.component.html'
})
export class CartComponent implements OnInit{
  cantidad: number = 0;
  cart!: Cart;
  
  constructor(  private route: ActivatedRoute,
                private router: Router,
                private sharingDataService: SharingDataService,
                private cartStore: Store<{carts: any}>,){
                  this.cartStore.select('carts').subscribe(state =>{                   
                    this.cart = state.cart;
                  })
                }

  ngOnInit(): void {
    
  }
  

  decrease(event: Event, orderedProduct: OrderedProduct){
    event.stopPropagation();
    if(orderedProduct.quantity > 0){
      this.sharingDataService.modifyProductQuantityCartEventEmitter.emit({diferential: -1, orderedProduct});
    }
  }
  increase(event: Event,orderedProduct: OrderedProduct){
    event.stopPropagation();
    this.sharingDataService.modifyProductQuantityCartEventEmitter.emit({diferential: 1, orderedProduct});
  }
  remove(event: Event,orderedProduct: OrderedProduct){
    event.stopPropagation();
    this.sharingDataService.removeProductCartEventEmitter.emit(orderedProduct);
  }
  cleanCart(){
    this.sharingDataService.cleanCartEventEmitter.emit();
  }
  close(){
    this.sharingDataService.closeCartEventEmitter.emit();
     
  }
  detailProduct(orderedProduct: OrderedProduct){
    //MOMENDO DE OCIO: HACER QUE PRODUCTDETAIL ESTE EN CONCORDANCIA CON CARRITO (QUE RECIBA QUANTITY Y SE PUEDA MODICICAR DESDE PRODUCTO DEATIL EL QUANTITY DEL CARRITO)
    this.sharingDataService.closeCartEventEmitter.emit();
    this.router.navigate(['/product_detail/', orderedProduct.finalProduct.base_product_id]);
  }

  getShortDescription(text: string): string{
    if(text == undefined){
      return ''
    }
    //SE PODRIA OPTIMIZAR A QUE EN DESKTOP SEA 45 O MAS Y MOBILE 35
    if(text.length > 35){
      return text.substring(0, 35) + '...'
    }
    return text;
  }

  formatCurrency(value: number): string {
    if(value == undefined){
      value = 0;
    }
    return value.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });
  }
  
}
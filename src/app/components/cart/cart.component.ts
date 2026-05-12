import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { SharingDataService } from '../../services/sharing-data.service';
import { Cart, ProductInCart } from '../../models/general.model';
import { cleanCart, decreaseProductQuantity, increaseProductQuantity, removeProduct } from '../../store/cart/cart.action';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'cart',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './cart.component.html'
})
export class CartComponent implements OnInit{
  cart: Cart = new Cart();
  
  constructor(private router: Router,
    private sharingDataService: SharingDataService,
    private cartStore: Store<{carts: any}>,
    private alertService: AlertService)
  {
    this.cartStore.select('carts').subscribe(state =>{                   
      this.cart = state.cart;
    })
  }

  ngOnInit(): void {}
  
  decrease(event: Event, productInCart: ProductInCart){
    if(productInCart.quantity == 0) return
    event.stopPropagation()
    this.cartStore.dispatch(decreaseProductQuantity({ finalProductId: productInCart.finalProductId}))
  }

  increase(event: Event, productInCart: ProductInCart){
    event.stopPropagation()
    this.cartStore.dispatch(increaseProductQuantity({ finalProductId: productInCart.finalProductId}))
  }

  remove(event: Event,productToRemove: ProductInCart){
    event.stopPropagation();
    this.cartStore.dispatch(removeProduct({ product: productToRemove }));
  }

  cleanCart(){
    const config = {
      title: 'Vaciar carrito',
      text: '¿Deseas eliminar todos los productos del carrito?',
      icon: 'warning' as const,
      confirmButtonText: 'Si, vaciar',
      confirmButtonColor: '#d33'
    }
    this.alertService.confirm(config, () => this.cartStore.dispatch(cleanCart()))
  }
  
  close(){
    this.sharingDataService.closeCartEventEmitter.emit();
  }

  detailProduct(productInCart: ProductInCart){
    this.sharingDataService.closeCartEventEmitter.emit();
    this.router.navigate(['/product_detail/', productInCart.baseProductId]);
  }

  getShortDescription(text: string): string{
    if(text == undefined) return ''
    if(text.length > 35) return text.substring(0, 35) + '...'
    return text
  }

  formatCurrency(value: number): string {
    if(value == undefined)   value = 0;
    return value.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });
  }
  
}
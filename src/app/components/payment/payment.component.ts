import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SharingDataService } from '../../services/sharing-data.service';
import { Store } from '@ngrx/store';
import { SaleService } from '../../services/sale.service';
import { Direction } from '../../models/general.model'; 
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { DirectionService } from '../../services/direction.service';
import { firstValueFrom } from 'rxjs';
import { CartForPayment, Cart, OrderedProductDTO } from '../../models/general.model';
import { cleanCart } from '../../store/cart/cart.action';

@Component({
  selector: 'payment',
  standalone: true,
  imports: [RouterModule, FormsModule],
  templateUrl: './payment.component.html'
})
export class PaymentComponent implements OnInit {
  directionList!: Direction[]
  selectedDirection!: Direction
  cart!: Cart

  constructor(
    private router: Router,
    private authService: AuthService,
    private saleService: SaleService,
    private sharingDataService: SharingDataService,
    private directionService: DirectionService,
    private cartStore: Store<{ carts: any }>) 
  {
    this.cartStore.select('carts').subscribe(state => {
      this.cart = state.cart
    })
  }

  ngOnInit(): void {
    this.sharingDataService.hideSearchBarEventEmitter.emit()
    this.getDirections(this.authService.user.user.id)
  }

  async getDirections(user_id: number) {
    try {
      const res = await firstValueFrom(this.directionService.getByUserId(user_id))
      this.directionList = res
    } catch (err) {
      console.error('fallo getDirections', err)
    }
  }

  async onPayCart() {
    const cartForPayment = this.getCartForPayment()
    try{
      const response = await firstValueFrom(this.saleService.createSale(cartForPayment))
      alert('Pago realizado con exito!')
      this.cleanCartAndReload()
    }catch(err){
      console.error('error en paycart', err)
    }
  }

  cleanCartAndReload(){
    this.cartStore.dispatch(cleanCart())
    this.router.navigate(['/home']);
  }

  getCartForPayment(): CartForPayment {
    const cart: CartForPayment = new CartForPayment()
    cart.direction_id = this.selectedDirection.direction_id
    cart.user_id = this.authService.user.user.id
    cart.products = this.cart.products.map(product => new OrderedProductDTO(product.quantity, product.finalProductId))
    return cart
  }

  selectDirection(direction: Direction) {
    this.selectedDirection = direction;
    const confirmButtonNode = document.getElementById('confirmButton');
    confirmButtonNode?.classList.remove('button--disabled');
    confirmButtonNode?.removeAttribute('disabled');
    this.directionList.forEach(item => {
      let node = document.getElementById(`${item.direction_id}`);
      item.direction_id === this.selectedDirection.direction_id ? node?.classList.add('card--selected') : node?.classList.remove('card--selected')
    })
  }

}

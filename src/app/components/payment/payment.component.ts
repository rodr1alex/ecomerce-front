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
import { CartForPayment, Cart, OrderedProduct } from '../../models/general.model';
import { cleanCart } from '../../store/cart/cart.action';
import { AlertService } from '../../services/alert.service';

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
    private alertService: AlertService,
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
      await firstValueFrom(this.saleService.createSale(cartForPayment))
      await this.alertService.success('Exito', 'Pago realizado con exito!')
      this.cleanCartAndReload()
    }catch(err: any){
      console.error('error en paycart', err)
      const errorMessage = this.getPaymentErrorMessage(err)
      await this.alertService.error('Error', errorMessage)
    }
  }

  private getPaymentErrorMessage(err: any): string {
    if (err?.status === 409 && err?.error && typeof err.error === 'object') {
      const firstKey = Object.keys(err.error)[0]
      const productIds = firstKey ? err.error[firstKey] : null

      if (Array.isArray(productIds) && productIds.length > 0) {
        const details = productIds.map((finalProductId: number) => {
          const product = this.cart.products.find(item => item.finalProductId === finalProductId)

          if (!product) {
            return `ID ${finalProductId}`
          }

          return `${product.name} | Talla: ${product.size} | Color: ${product.color}`
        })

        return `No hay stock para:\n\n${details.join('\n')}`
      }
    }

    if (typeof err?.error === 'string' && err.error.trim().length > 0) {
      return err.error
    }

    return 'No se pudo procesar el pago. Intentalo nuevamente.'
  }

  cleanCartAndReload(){
    this.cartStore.dispatch(cleanCart())
    this.router.navigate(['/home']);
  }

  getCartForPayment(): CartForPayment {
    const cart: CartForPayment = new CartForPayment()
    cart.directionId = this.selectedDirection.directionId
    cart.userId = this.authService.user.user.id
    cart.products = this.cart.products.map(product => new OrderedProduct(product.quantity, product.finalProductId))
    return cart
  }

  selectDirection(direction: Direction) {
    this.selectedDirection = direction;
    const confirmButtonNode = document.getElementById('confirmButton');
    confirmButtonNode?.classList.remove('button--disabled');
    confirmButtonNode?.removeAttribute('disabled');
    this.directionList.forEach(item => {
      let node = document.getElementById(`${item.directionId}`);
      item.directionId === this.selectedDirection.directionId ? node?.classList.add('card--selected') : node?.classList.remove('card--selected')
    })
  }

}

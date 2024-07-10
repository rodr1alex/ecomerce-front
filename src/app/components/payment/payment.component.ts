import { Component, OnInit } from '@angular/core';
import { Cart } from '../../models/cart.model';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SharingDataService } from '../../services/sharing-data.service';
import { Store } from '@ngrx/store';
import { SaleService } from '../../services/sale.service';
import { Direction } from '../../models/direction.model';
import { UserComponent } from '../user/user.component';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'payment',
  standalone: true,
  imports: [RouterModule, FormsModule],
  templateUrl: './payment.component.html'
})
export class PaymentComponent implements OnInit{
  directionList!: Direction[]
  selectedDirection!: Direction;
  cart!: Cart;

  

  constructor(  private route: ActivatedRoute,
                private router: Router,
                private userService: UserService,
                private authService: AuthService,
                private saleService: SaleService,
                private sharingDataService: SharingDataService,
                private cartStore: Store<{carts: any}>,){
                  this.cartStore.select('carts').subscribe(state =>{                   
                    this.cart = state.cart
                  })
                }

ngOnInit(): void {
  this.sharingDataService.hiddeSearchBarEventEmitter.emit();
    this.userService.findById(this.authService.user.user.id).subscribe(
      {
        next: response => {
          this.directionList = response.directionList;
        },
        error: error =>{
          throw error;
        }
      }
    )
  }


  payCart(){
    if(this.selectedDirection){
      this.sharingDataService.payCartEventEmitter.emit(this.selectedDirection);
    }else{
      alert('Seleccione una direccion')
    }
    
  }
  selectDirection(direction: Direction){
    this.selectedDirection = direction;
    const confirmButtonNode = document.getElementById('confirmButton');
    confirmButtonNode?.classList.remove('button--disabled');
    confirmButtonNode?.removeAttribute('disabled');
    this.directionList.map(item=>{
      let node = document.getElementById(`${item.direction_id}`);
      item.direction_id === this.selectedDirection.direction_id? node?.classList.add('card--selected'):node?.classList.remove('card--selected')
    })
  }

}

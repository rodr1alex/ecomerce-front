import { Component, OnInit } from '@angular/core';
import { Sale } from '../../../models/sale.model';
import { User } from '../../../models/user.model';
import { Cart } from '../../../models/cart.model';
import { Direction } from '../../../models/direction.model';
import { BaseProductService } from '../../../services/base-product.service';
import { FinalProductService } from '../../../services/final-product.service';
import { CategoryService } from '../../../services/category.service';
import { BrandService } from '../../../services/brand.service';
import { ColorService } from '../../../services/color.service';
import { SizeService } from '../../../services/size.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { SaleService } from '../../../services/sale.service';
import { CartService } from '../../../services/cart.service';
import { CartComponent } from '../../cart/cart.component';

@Component({
  selector: 'app-sale',
  standalone: true,
  imports: [CartComponent, RouterModule],
  templateUrl: './sale.component.html'
})
export class SaleComponent implements OnInit{
  sale!: Sale;
  user!: User;
  cart: Cart = new Cart();
  mostrar: boolean = false;

  constructor(
    private baseProductService: BaseProductService,
    private finalProductService: FinalProductService,
    private categoryService: CategoryService,
    private brandService: BrandService,
    private colorService: ColorService,
    private sizeService: SizeService,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private saleService: SaleService,
    private cartService: CartService
  ){

}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const sale_id = +(params.get('sale_id') || '0');;
      this.saleService.findById(sale_id).subscribe({
        next: response =>{
          this.sale = response;
          console.log("sale:", this.sale);
          this.userService.findById(this.sale.user_id).subscribe({
            next: response =>{
              this.user = response;
              console.log('User:', this.user);
              this.cart = this.user.cartList.find(item => item.cart_id === this.sale.cart_id) || new Cart();
              console.log('Carrito:',this.cart);
            }
          })
        }
      })
    })

    
  }
  
  formatCurrency(value: number): string {
    if(value == undefined){
      value = 0;
    }
    return value.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });
  }




}

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
import { OrderedProduct } from '../../../models/ordered-product.model';
import { FinalProduct } from '../../../models/final-product.model';
import { BaseProduct } from '../../../models/base-product.model';
import { ColorVariantProduct } from '../../../models/color-variant-product.model';

@Component({
  selector: 'app-sale',
  standalone: true,
  imports: [CartComponent, RouterModule],
  templateUrl: './sale.component.html'
})
export class SaleComponent implements OnInit{
  sale!: Sale;
  user!: User;
  baseProduct!: BaseProduct;
  colorVariantProduct!: ColorVariantProduct;
  cart: Cart = new Cart();
  mostrar: boolean = false;
  returnProductQuantityList : number [] = [];



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
          this.userService.findById(this.sale.user_id).subscribe({
            next: response =>{
              this.user = response;
              this.cart = this.user.cartList.find(item => item.cart_id === this.sale.cart_id) || new Cart();
              for(let orderedProduct of this.cart.orderedProductList){
                this.returnProductQuantityList.push(orderedProduct.originalquantity - orderedProduct.quantity);
              }
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

  cancelSale(){
    let orderedProductListToSend: OrderedProduct[] = []
    for(let i = 0; i < this.cart.orderedProductList.length ; i++){
      let orderedProductReturn = new OrderedProduct();
      let finalProductReturn = new FinalProduct();
      finalProductReturn.final_product_id = this.cart.orderedProductList[i].finalProduct.final_product_id;
      orderedProductReturn.quantity = 0;
      orderedProductReturn.finalProduct = finalProductReturn;
      orderedProductListToSend.push(orderedProductReturn);
    }

    this.saleService.modifySale(this.sale.sale_id, orderedProductListToSend).subscribe({
      next: response =>{
        alert('Anulacion de venta exitosa')
      }
    })
  }
  updateSale(){
    let orderedProductListToSend: OrderedProduct[] = []
    for(let i = 0; i < this.cart.orderedProductList.length ; i++){
      let orderedProductReturn = new OrderedProduct();
      let finalProductReturn = new FinalProduct();
      finalProductReturn.final_product_id = this.cart.orderedProductList[i].finalProduct.final_product_id;
      orderedProductReturn.quantity = this.cart.orderedProductList[i].originalquantity - this.returnProductQuantityList[i];
      orderedProductReturn.finalProduct = finalProductReturn;
      orderedProductListToSend.push(orderedProductReturn);
    }

    this.saleService.modifySale(this.sale.sale_id, orderedProductListToSend).subscribe({
      next: response =>{
        alert('Modificacion exitosa')
      }
    })
    

  }
  returnOneProduct(index: number){
    // let orderedProductReturn = new OrderedProduct();
    // let finalProductReturn = new FinalProduct();
    // finalProductReturn.final_product_id = this.cart.orderedProductList[index].finalProduct.final_product_id;
    // orderedProductReturn.ordered_product_id = this.cart.orderedProductList[index].ordered_product_id;
    // orderedProductReturn.quantity = this.cart.orderedProductList[index].quantity - this.returnProductQuantityList[index];
    // orderedProductReturn.finalProduct = finalProductReturn;
    // this.saleService.returnProduct(this.cart.sale.sale_id,orderedProductReturn).subscribe({
    //   next: response =>{
    //     console.log('Devuelto con exito! indice i:', index);
    //   }
    // })
  }
  decrease(index: number){
    if(this.returnProductQuantityList[index] > 0){
      this.returnProductQuantityList[index]--;
    }
    
  }

  increase(index: number){
    this.returnProductQuantityList[index]++;
  }

  getShortDescription(text: string): string{
    if(text == undefined){
      return ''
    }
    if(text.length > 25){
      return text.substring(0, 25) + '...'
    }
    return text;
  }


}

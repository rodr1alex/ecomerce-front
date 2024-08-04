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
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sale',
  standalone: true,
  imports: [CartComponent, RouterModule,FormsModule, CommonModule],
  templateUrl: './sale.component.html'
})
export class SaleComponent implements OnInit{
  sale: Sale = new Sale();
  user: User = new User();
  baseProduct!: BaseProduct;
  colorVariantProduct!: ColorVariantProduct;
  cart: Cart = new Cart();
  mostrar: boolean = false;
  returnProductQuantityList : number [] = [];
  originalReturnProductQuantityList : number [] = [];
  disableUpdateButton: boolean = true;



  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private saleService: SaleService,
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
                this.originalReturnProductQuantityList.push(orderedProduct.originalquantity - orderedProduct.quantity);
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
        alert('Anulación de venta exitosa')
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
        alert('Modificación exitosa')
      }
    })
    

  }
  
  decrease(index: number){
    if(this.returnProductQuantityList[index] > this.originalReturnProductQuantityList[index]){
      this.returnProductQuantityList[index]--;
    }   
    let aux = true;
    for(let i = 0 ; i < this.returnProductQuantityList.length; i ++){
      if(this.returnProductQuantityList[i] > this.originalReturnProductQuantityList[i]){
        aux = false;
      }
    } 
    this.disableUpdateButton = aux;
  }

  increase(index: number){
    if(this.returnProductQuantityList[index] < this.cart.orderedProductList[index].originalquantity){
      this.returnProductQuantityList[index]++;
      this.disableUpdateButton = false;
    }
    
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

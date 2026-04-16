import { Component, OnInit } from '@angular/core';
import { User } from '../../../models/user.model';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { SaleService } from '../../../services/sale.service';
import { BaseProduct } from '../../../models/base-product.model';
import { ColorVariantProduct } from '../../../models/color-variant-product.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductReturned, SaleDetail } from '../../../models/general.model';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-sale',
  standalone: true,
  imports: [RouterModule,FormsModule, CommonModule],
  templateUrl: './sale.component.html'
})
export class SaleComponent implements OnInit{
  saleDetail: SaleDetail = new SaleDetail();
  user: User = new User();
  baseProduct!: BaseProduct;
  colorVariantProduct!: ColorVariantProduct;
  mostrar: boolean = false;
  returnProductQuantityList : number [] = [];
  originalReturnProductQuantityList : number [] = [];
  disableUpdateButton: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private saleService: SaleService,
  ){}

  ngOnInit(): void {
    const sale_id: number = +(this.route.snapshot.paramMap.get('sale_id') || '0')
    this.getSaleDetail(sale_id)
  }

  async getSaleDetail(sale_id: number){
    try {
      const res = await firstValueFrom(this.saleService.findById(sale_id))
      this.saleDetail = res
      this.returnProductQuantityList = this.saleDetail.products.map(orderedProductDetail => orderedProductDetail.originalQuantity - orderedProductDetail.quantity)
      this.originalReturnProductQuantityList = this.saleDetail.products.map(orderedProductDetail => orderedProductDetail.originalQuantity - orderedProductDetail.quantity)
    } catch (error) {
      console.error('error en getSaleDetailById', error)
    }
  }
  
  async cancelSale(){
    try {
      const res = await firstValueFrom(this.saleService.cancelSale(this.saleDetail.sale_id))
      alert('Anulación de venta exitosa')
    } catch (error) {
      console.error('error en cancelSale', error)    
    }
  }

  async updateSale(){
    const orderedProductListToSend: ProductReturned[] = this.getOrderedProductListToSend()
    try {
      const res = await firstValueFrom(this.saleService.modifySale(this.saleDetail.sale_id, orderedProductListToSend))
      alert('Modificación exitosa')      
    } catch (error) {
      console.error('error en updateSale', error)      
    }
  }

  getOrderedProductListToSend(): ProductReturned[]{
    let orderedProductListToSend: ProductReturned[] = []
    for(let i = 0; i < this.saleDetail.products.length ; i++){
      let orderedProductReturn = new ProductReturned();
      orderedProductReturn.quantityToReturn = this.returnProductQuantityList[i] - this.originalReturnProductQuantityList[i];
      orderedProductReturn.final_product_id = this.saleDetail.products[i].final_product_id
      orderedProductReturn.ordered_product_id = this.saleDetail.products[i].ordered_product_id
      orderedProductListToSend.push(orderedProductReturn);
    }
    return orderedProductListToSend
  }
  
  decrease(index: number){
    if(this.returnProductQuantityList[index] <= this.originalReturnProductQuantityList[index]) return
    this.returnProductQuantityList[index]-- 
    let aux = true;
    for(let i = 0 ; i < this.returnProductQuantityList.length; i ++){
      if(this.returnProductQuantityList[i] > this.originalReturnProductQuantityList[i]) aux = false
    } 
    this.disableUpdateButton = aux;
  }

  increase(index: number){
    if(this.returnProductQuantityList[index] >= this.saleDetail.products[index].originalQuantity) return
    this.returnProductQuantityList[index]++;
    this.disableUpdateButton = false;
  }

  getShortDescription(text: string): string{
    if(text == undefined) return ''
    if(text.length > 25) return text.substring(0, 25) + '...'
    return text;
  }

  formatCurrency(value: number): string {
    if(value == undefined) value = 0
    return value.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });
  }

}

import { Component, OnInit } from '@angular/core';
import { BaseProduct } from '../../../models/base-product.model';
import { Brand } from '../../../models/brand.model';
import { BaseProductService } from '../../../services/base-product.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-view-product',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './view-product.component.html'
})
export class ViewProductComponent implements OnInit{
  baseProductList: BaseProduct[] =[];
  baseProduct: BaseProduct = new BaseProduct();
  brandList: Brand[]= []

  constructor(private baseProductService: BaseProductService){

  }
  ngOnInit(): void {
    this.baseProductService.findAllPageable(0).subscribe({
      next: response =>{
        this.baseProductList = response.content;
        console.log('respuesta del backend:', response);
        console.log('baserprodictList:', this.baseProductList);
      }
    })
  }
}

import { Component, Input, OnInit } from '@angular/core';
import { BaseProduct } from '../../models/base-product.model';

@Component({
  selector: 'product-card',
  standalone: true,
  imports: [],
  templateUrl: './product-card.component.html'
})
export class ProductCardComponent implements OnInit{
  @Input() baseProduct!: BaseProduct;

  

  ngOnInit(): void {
    
  }
}

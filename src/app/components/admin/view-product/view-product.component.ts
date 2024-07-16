import { Component, OnInit } from '@angular/core';
import { BaseProduct } from '../../../models/base-product.model';
import { Brand } from '../../../models/brand.model';
import { BaseProductService } from '../../../services/base-product.service';
import { ActivatedRoute, Route, Router, RouterModule } from '@angular/router';
import { FinalProduct } from '../../../models/final-product.model';
import { FinalProductService } from '../../../services/final-product.service';
import { FormsModule } from '@angular/forms';
import { BrandService } from '../../../services/brand.service';
import { CommonModule } from '@angular/common';
import { Color } from '../../../models/color.model';
import { Size } from '../../../models/size.model';
import { Category } from '../../../models/category.model';
import { CategoryService } from '../../../services/category.service';
import { ColorService } from '../../../services/color.service';
import { SizeService } from '../../../services/size.service';
import { PaginatorComponent } from '../../paginator/paginator.component';
import { tick } from '@angular/core/testing';

@Component({
  selector: 'app-view-product',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule, PaginatorComponent],
  templateUrl: './view-product.component.html'
})
export class ViewProductComponent implements OnInit{
  baseProductList: BaseProduct[] =[];
  baseProduct: BaseProduct = new BaseProduct();
  finalProductList: FinalProduct[] =[];
  categoryList: Category[] =[];
  brandList: Brand[]= []
  colorList: Color[] = [];
  sizeList: Size[] = [];
  selectedCategory: string = '';
  selectedBrand: string = '';
  selectedColor: string = '';
  selectedSize: string = '';
  paginator!: any;
  url: string = '/admin_panel/0';
  page!: number;
  pageSizeList: number[] = [5,10,20,50,100,200,500];
  selectedPageSize: string = '100';

  constructor(
      private baseProductService: BaseProductService,
      private finalProductService: FinalProductService,
      private categoryService: CategoryService,
      private brandService: BrandService,
      private colorService: ColorService,
      private sizeService: SizeService,
      private route: ActivatedRoute,
      private router: Router
    ){

  }
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.page = +(params.get('page') || '0');;
      this.filter();
    })

    
    this.categoryService.getAll().subscribe({
      next: response =>{
        this.categoryList = response;
      }
    })

    this.brandService.getAll().subscribe({
      next: response =>{
        this.brandList = response;
      }
    });

    this.colorService.getAll().subscribe({
      next: response =>{
        this.colorList = response;
      }
    });

    this.sizeService.getAll().subscribe({
      next: response =>{
        this.sizeList = response;
      }
    })


    this.filter();
  }
  onChange(event: Event){
    this.filter();
    this.router.navigate(['/admin_panel/0/0'])
  }

  filter(){
    if(this.selectedCategory == ''){
      this.selectedCategory = '0';
    }
    if(this.selectedBrand == ''){
      this.selectedBrand = '0';
    }
    if(this.selectedColor == ''){
      this.selectedColor = '0';
    }
    if(this.selectedSize == ''){
      this.selectedSize = '0';
    }
    console.log(`Estado actual para hacer pedido de filtrado: categoty_id:${this.selectedCategory}, brand_id:${this.selectedBrand}, color_id:${this.selectedColor} size_id:${this.selectedSize}`);
    const categoryList: Category[] = [new Category(+this.selectedCategory, '')];
    console.log('CategoryList: ', categoryList);
    this.finalProductService.filter(+this.selectedBrand, +this.selectedColor, +this.selectedSize, +this.selectedPageSize ,+this.page, categoryList).subscribe({
      next: response =>{
        this.finalProductList = response.content;
        this.paginator = response;
      }
    })
    if(this.selectedCategory == '0'){
      this.selectedCategory = '';
    }
    if(this.selectedBrand == '0'){
      this.selectedBrand = '';
    }
    if(this.selectedColor == '0'){
      this.selectedColor = '';
    }
    if(this.selectedSize == '0'){
      this.selectedSize = '';
    }
  }
  unfilter(){
    this.selectedCategory = '';
    this.selectedBrand = '';
    this.selectedColor = '';
    this.selectedSize = '';
    this.filter();
  }
  removeSizeFilter(){
    this.selectedSize = '';
    this.filter();
  }
  removeCategoryFilter(){
    this.selectedCategory = '';
    this.filter();
  }
  removeBrandFilter(){
    this.selectedBrand = '';
    this.filter();
  }
  removeColorFilter(){
    this.selectedColor = '';
    this.filter();
  }
}

import { Component, OnInit } from '@angular/core';
import { BaseProduct } from '../../../models/base-product.model';
import { FormsModule } from '@angular/forms';
import { BaseProductService } from '../../../services/base-product.service';
import { Brand } from '../../../models/brand.model';
import { ActivatedRoute } from '@angular/router';
import { BrandService } from '../../../services/brand.service';
import { CommonModule } from '@angular/common';
import { ColorVariantProduct } from '../../../models/color-variant-product.model';
import { FinalProduct } from '../../../models/final-product.model';
import { Color } from '../../../models/color.model';
import { ColorService } from '../../../services/color.service';
import { Size } from '../../../models/size.model';
import { SizeService } from '../../../services/size.service';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../models/category.model';
import { BaseProductImage } from '../../../models/base-product-image.model';
import { ColorVariantProductImage } from '../../../models/color-variant-product-image.model';
import { ColorVariantProductService } from '../../../services/color-variant-product.service';
import { FinalProductService } from '../../../services/final-product.service';

@Component({
  selector: 'product',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './product.component.html'
})
export class ProductComponent implements OnInit{
  baseProductList: BaseProduct[] =[];
  baseProduct: BaseProduct = new BaseProduct();
  brandList: Brand[]= []
  selectedBrand: string = ''; 
  colorList: Color[] = [];
  selectedColor: string[] = [];
  sizeList: Size[] = [];
  selectedSize: string = '';
  categoryList: Category[] = [];
  selectedCategory: string = '';
  baseProductImage: BaseProductImage = new BaseProductImage();
  colorVariantProductImage: ColorVariantProductImage = new ColorVariantProductImage();
  colorVariantProductImageList: ColorVariantProductImage[] = [];
  originalFinalProductListLength: number[] = [];

  constructor(
    private baseProductService: BaseProductService,
    private route: ActivatedRoute,
    private brandService: BrandService,
    private colorService: ColorService,
    private sizeService: SizeService,
    private categoryService: CategoryService,
    private colorVariantProductService: ColorVariantProductService,
    private finalProductService: FinalProductService
){}

  ngOnInit(): void {
    

    if(this.baseProduct.categoryList == undefined){
      this.baseProduct.categoryList = []
    }

    this.brandService.getAll().subscribe({
      next: response =>{
        this.brandList = response;
        console.log(this.brandList);
      }
    });

    this.colorService.getAll().subscribe({
      next: response =>{
        this.colorList = response;
        console.log('colores: ', this.colorList)
      }
    });

    this.sizeService.getAll().subscribe({
      next: response =>{
        this.sizeList = response;
      }
    })

    this.categoryService.getAll().subscribe({
      next: response =>{
        this.categoryList = response;
        console.log(this.categoryList)
      }
    })

    this.route.paramMap.subscribe(params => {
      const base_product_id = +(params.get('base_product_id') || '0');
      if(base_product_id == 0){
        let finalProduct = new FinalProduct();
        finalProduct.final_product_id = 1;
        finalProduct.size = new Size();
        let colorVariantProduct = new ColorVariantProduct();
        colorVariantProduct.color_variant_product_id = 1;
        colorVariantProduct.color = new Color();
        colorVariantProduct.finalProductList = [finalProduct];
        this.baseProduct.colorVariantProductList = [colorVariantProduct];
      }else{
        this.baseProductService.findById(base_product_id).subscribe({
          next: response =>{
            this.baseProduct = response;
            this.selectedBrand = this.baseProduct.brand.brand_id + '';
            for(let category of this.baseProduct.categoryList){
              const optionNode = document.getElementById(`${category.name}`);
              optionNode?.setAttribute('disabled', 'true');
            }
            for(let colorVariantProduct of this.baseProduct.colorVariantProductList){
              //INTENTAR IMPLEMENTAR LA DESHABILITACION DE TALLAS OCUPADAS, FALLA EL IDENTIFICADOR Y OBTENCION DEL NODO
              // let usedSizeList: string[] = []
              // for(let finalProduct of colorVariantProduct.finalProductList){
              //   usedSizeList.push(finalProduct.size.name);
              // }
              // console.log('Cada listado de tallas usadas:', usedSizeList);
              // for(let finalProduct of colorVariantProduct.finalProductList){
              //   const id = `${finalProduct.size.name}${colorVariantProduct.color_variant_product_id}`
              //   console.log('identificador del nodo a desabilitar: ', id);
              //   const node = document.getElementById(id);
              //   console.log(node);
              // }
              this.originalFinalProductListLength.push(colorVariantProduct.finalProductList.length);
              let finalProduct = new FinalProduct();
              finalProduct.size = new Size();
              //agrgar final_product_id incremental;
              colorVariantProduct.finalProductList.push(finalProduct)
              

            }
          }
        })
      }
    })  

  }

 onChange(event: Event){
    this.addCategory();
  }
  addSize(colorVariantProduct: ColorVariantProduct){
    let i = this.baseProduct.colorVariantProductList.indexOf(colorVariantProduct);
    const lastFinalProductID = this.baseProduct.colorVariantProductList[i].finalProductList[this.baseProduct.colorVariantProductList[i].finalProductList.length - 1].final_product_id;
    let finalProduct = new FinalProduct();
    finalProduct.final_product_id = lastFinalProductID + 1;
    finalProduct.size = new Size();
    let size_id = this.baseProduct.colorVariantProductList[i].finalProductList[this.baseProduct.colorVariantProductList[i].finalProductList.length - 1].size.size_id;
    const sizeName: string = this.sizeList.find(item => item.size_id == size_id)?.name || ''; 
    this.baseProduct.colorVariantProductList[i].finalProductList[this.baseProduct.colorVariantProductList[i].finalProductList.length - 1].size.name = sizeName;
    this.baseProduct.colorVariantProductList[i].finalProductList.push(finalProduct);

  }
  removeSize(colorVariantProduct: ColorVariantProduct, finalProduct: FinalProduct){
    colorVariantProduct.finalProductList = colorVariantProduct.finalProductList.filter(item => item.final_product_id != finalProduct.final_product_id);

  }
  addColorVariantProductForm(){
    let finalProduct = new FinalProduct();
    finalProduct.final_product_id = 1;
    finalProduct.size = new Size();
    let colorVariantProduct = new ColorVariantProduct();
    const lastColorVariantProductID = this.baseProduct.colorVariantProductList[this.baseProduct.colorVariantProductList.length -1].color_variant_product_id;
    colorVariantProduct.color_variant_product_id = lastColorVariantProductID + 1;
    colorVariantProduct.color = new Color();
    colorVariantProduct.finalProductList = [finalProduct];
    this.baseProduct.colorVariantProductList.push(colorVariantProduct);
  }
  removeColorVariantProduct(colorVariantProduct: ColorVariantProduct){
    this.baseProduct.colorVariantProductList = this.baseProduct.colorVariantProductList.filter(item => item.color_variant_product_id != colorVariantProduct.color_variant_product_id);
  }
  addImage(){
    if(this.baseProduct.baseProductImageList == undefined){
      this.baseProduct.baseProductImageList = [];
    }
    const baseProductImage = new BaseProductImage();
    baseProductImage.url = this.baseProductImage.url;
    this.baseProduct.baseProductImageList.push(baseProductImage);
    this.baseProductImage.url = '';
  }
  removeImage(baseProductImage: BaseProductImage){
    this.baseProduct.baseProductImageList = this.baseProduct.baseProductImageList.filter(item => item.url != baseProductImage.url);
  }
  addColorVariantProductImage(colorVariantProduct: ColorVariantProduct){
    let i = this.baseProduct.colorVariantProductList.indexOf(colorVariantProduct);
    if(this.baseProduct.colorVariantProductList[i].colorVariantProductImageList == undefined){
      this.baseProduct.colorVariantProductList[i].colorVariantProductImageList = [];
    }
    const colorVariantProductImage = new ColorVariantProductImage();
      colorVariantProductImage.url = this.colorVariantProductImage.url;
      this.baseProduct.colorVariantProductList[i].colorVariantProductImageList.push(colorVariantProductImage);
      this.colorVariantProductImage.url = '';
      console.log('wea', this.baseProduct.colorVariantProductList[i].colorVariantProductImageList)
  }
  removeColorVariantProductImage(colorVariantProductImage: ColorVariantProductImage, colorVariantProduct: ColorVariantProduct){
    let i = this.baseProduct.colorVariantProductList.indexOf(colorVariantProduct);
    this.baseProduct.colorVariantProductList[i].colorVariantProductImageList = this.baseProduct.colorVariantProductList[i].colorVariantProductImageList.filter(item => item.url != colorVariantProductImage.url);
  }
  addCategory(){
    const categoryName: string = this.categoryList.find(item => item.category_id === +this.selectedCategory)?.name || '';
    const optionNode = document.getElementById(`${categoryName}`);
    optionNode?.setAttribute('disabled', 'true');
    this.baseProduct.categoryList.push(new Category(+this.selectedCategory,categoryName));
    console.log(this.baseProduct.categoryList)
  }
  removeCategory(category: Category){
    const optionNode = document.getElementById(`${category.name}`);
    optionNode?.removeAttribute('disabled');
    this.selectedCategory = '';
    this.baseProduct.categoryList = this.baseProduct.categoryList.filter(item => item.category_id != category.category_id);
  }
  createProduct(){
    
    let brand = new Brand();
    brand.brand_id = +this.selectedBrand;
    this.baseProduct.brand = brand;

    const baseProductCopy = new BaseProduct();
    baseProductCopy.name = this.baseProduct.name;
    baseProductCopy.base_price = this.baseProduct.base_price;
    baseProductCopy.description = this.baseProduct.description;
    baseProductCopy.chars = this.baseProduct.chars;
    baseProductCopy.specs = this.baseProduct.specs;
    baseProductCopy.categoryList = this.baseProduct.categoryList;
    baseProductCopy.brand = brand;
    baseProductCopy.baseProductImageList = this.baseProduct.baseProductImageList;
    this.baseProductService.create(baseProductCopy).subscribe({
      next: response =>{
        console.log('Producto agregado con exito!', response);
        for(let i = 0; i < this.baseProduct.colorVariantProductList.length ; i++){
            const colorVariantProductCopy = new ColorVariantProduct();
            colorVariantProductCopy.baseProduct = response;
            colorVariantProductCopy.colorVariantProductImageList = this.baseProduct.colorVariantProductList[i].colorVariantProductImageList;
            const color = new Color();
            color.color_id = this.baseProduct.colorVariantProductList[i].color.color_id;
            colorVariantProductCopy.color = color;
            this.colorVariantProductService.create(colorVariantProductCopy).subscribe({
              next: response =>{
                for(let j = 0; j < this.baseProduct.colorVariantProductList[i].finalProductList.length; j++){
                  console.log('Variacion de color agregada con exito, estoy en el indice i: ', i);
                  const finalProductCopy = new FinalProduct();
                  finalProductCopy.colorVariantProduct = response;
                  finalProductCopy.size = this.baseProduct.colorVariantProductList[i].finalProductList[j].size;
                  finalProductCopy.final_price = this.baseProduct.colorVariantProductList[i].finalProductList[j].final_price;
                  finalProductCopy.stock = this.baseProduct.colorVariantProductList[i].finalProductList[j].stock;
                  this.finalProductService.create(finalProductCopy).subscribe({
                    next: response=>{
                      console.log('Producto final agregado con exito!, estoy en el indice j: ', j);
                    }
                  })
                }
              }
            })
        }
      }
    })
  }

  addColorVariantProduct(){
    this.createProduct();
    const colorVariantProductCopy = new ColorVariantProduct();
    colorVariantProductCopy.baseProduct = this.baseProduct;
    colorVariantProductCopy.colorVariantProductImageList = this.baseProduct.colorVariantProductList[0].colorVariantProductImageList;
    const color = new Color();
    color.color_id = +this.selectedColor;
    colorVariantProductCopy.color = color;
    this.colorVariantProductService.create(colorVariantProductCopy).subscribe({
      next: response =>{
        console.log('Variacion de color agregada con exito');
        this.baseProduct.colorVariantProductList = [response];
      }
    })
  }

}

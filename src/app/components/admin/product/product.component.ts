import { Component, OnInit } from '@angular/core';
import { BaseProduct } from '../../../models/base-product.model';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { BaseProductService } from '../../../services/base-product.service';
import { Brand } from '../../../models/brand.model';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
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
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './product.component.html'
})
export class ProductComponent implements OnInit{
  baseProductList: BaseProduct[] =[];
  baseProduct: BaseProduct = new BaseProduct();
  baseProductOriginal: BaseProduct = new BaseProduct();
  colorVariantProductListOriginal: ColorVariantProduct[] = [];
  categoryListOriginal: Category[] = [];
  baseProductImageListOriginal: BaseProductImage[] = [];
  addImageList: BaseProductImage[] = [];
  removeImageList: BaseProductImage[] = [];
  addColorVariantProductImageList: ColorVariantProductImage[]= [];
  removeColorVariantProductImageList: ColorVariantProductImage[]= [];
  brandOriginal!:Brand;
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
  finalProductListInvalid: boolean = true;

  constructor(
    private baseProductService: BaseProductService,
    private route: ActivatedRoute,
    private router: Router,
    private brandService: BrandService,
    private colorService: ColorService,
    private sizeService: SizeService,
    private categoryService: CategoryService,
    private colorVariantProductService: ColorVariantProductService,
    private finalProductService: FinalProductService
){
  
}

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
              this.originalFinalProductListLength.push(colorVariantProduct.finalProductList.length);
              let finalProduct = new FinalProduct();
              finalProduct.size = new Size();
              //agrgar final_product_id incremental;
              colorVariantProduct.finalProductList.push(finalProduct)
            }
            //copiar base product a baseProductOriginal
            this.baseProductOriginal = {... this.baseProduct};
            console.log('Se ha reailzado una copia del baseProduct original: ', this.baseProductOriginal);
            this.categoryListOriginal = [... this.baseProduct.categoryList]
            this.baseProductImageListOriginal = [... this.baseProduct.baseProductImageList]
            this.brandOriginal = {...this.baseProduct.brand};
            this.colorVariantProductListOriginal = this.deepClone(response.colorVariantProductList);
          }
        })
      }
    })  
  }

 onChange(event: Event){
    this.addCategory();
  }
  onColorChange(event: Event){
    this.colorVariantProductValidForm();
  }

 
  addSize(colorVariantProduct: ColorVariantProduct){
    let i = this.baseProduct.colorVariantProductList.indexOf(colorVariantProduct);
    const lastFinalProductID = this.baseProduct.colorVariantProductList[i].finalProductList[this.baseProduct.colorVariantProductList[i].finalProductList.length - 1].final_product_id;
    let finalProduct = new FinalProduct();
    finalProduct.final_product_id = lastFinalProductID + 1;
    finalProduct.stock = this.baseProduct.colorVariantProductList[i].finalProductList[this.baseProduct.colorVariantProductList[i].finalProductList.length - 1].stock;
    finalProduct.final_price = this.baseProduct.base_price;
    finalProduct.size = new Size();
    let size_id = this.baseProduct.colorVariantProductList[i].finalProductList[this.baseProduct.colorVariantProductList[i].finalProductList.length - 1].size.size_id;
    const sizeName: string = this.sizeList.find(item => item.size_id == size_id)?.name || ''; 
    this.baseProduct.colorVariantProductList[i].finalProductList[this.baseProduct.colorVariantProductList[i].finalProductList.length - 1].size.name = sizeName;
    this.baseProduct.colorVariantProductList[i].finalProductList.push(finalProduct);
    this.colorVariantProductValidForm();
  }
  removeSize(colorVariantProduct: ColorVariantProduct, finalProduct: FinalProduct){
    colorVariantProduct.finalProductList = colorVariantProduct.finalProductList.filter(item => item.final_product_id != finalProduct.final_product_id);
    this.colorVariantProductValidForm();
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
    this.colorVariantProductValidForm();
  }
  removeColorVariantProduct(colorVariantProduct: ColorVariantProduct){
    this.baseProduct.colorVariantProductList = this.baseProduct.colorVariantProductList.filter(item => item.color_variant_product_id != colorVariantProduct.color_variant_product_id);
    this.colorVariantProductValidForm();
  }
  addImage(){
    if(this.baseProduct.baseProductImageList == undefined){
      this.baseProduct.baseProductImageList = [];
    }
    const baseProductImage = new BaseProductImage();
    baseProductImage.url = this.baseProductImage.url;
    this.baseProduct.baseProductImageList.push(baseProductImage);
    this.baseProductImage.url = '';
    this.addImageList.push(baseProductImage);
    if(this.baseProduct.base_product_id > 0){
      let node = document.getElementById('resetBaseProduct');
      node?.classList.remove('button--disabled');
      node?.removeAttribute('disabled');
      let nodeBaseProduct = document.getElementById('updateBaseProduct');
      nodeBaseProduct?.classList.remove('button--disabled');
      nodeBaseProduct?.removeAttribute('disabled');
    }
  }
  removeImage(baseProductImage: BaseProductImage){
    this.removeImageList.push(this.baseProduct.baseProductImageList.find(item => item.url == baseProductImage.url) || new BaseProductImage());
    this.baseProduct.baseProductImageList = this.baseProduct.baseProductImageList.filter(item => item.url != baseProductImage.url);
    if(this.baseProduct.base_product_id > 0){
      let node = document.getElementById('resetBaseProduct');
      node?.classList.remove('button--disabled');
      node?.removeAttribute('disabled');
      let nodeBaseProduct = document.getElementById('updateBaseProduct');
      nodeBaseProduct?.classList.remove('button--disabled');
      nodeBaseProduct?.removeAttribute('disabled');
    }
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
      this.addColorVariantProductImageList.push(colorVariantProductImage);
      if(this.baseProduct.base_product_id > 0){
        let nodeReset = document.getElementById(`resetColorVariantProductImages${i}`);
        nodeReset?.classList.remove('button--disabled');
        nodeReset?.removeAttribute('disabled');
        let nodeUpdate = document.getElementById(`updateColorVariantProductImages${i}`);
        nodeUpdate?.classList.remove('button--disabled');
        nodeUpdate?.removeAttribute('disabled');
      }
      this.colorVariantProductValidForm();
  }

  removeColorVariantProductImage(colorVariantProductImage: ColorVariantProductImage, colorVariantProduct: ColorVariantProduct){
    let i = this.baseProduct.colorVariantProductList.indexOf(colorVariantProduct);
    this.removeColorVariantProductImageList.push(this.baseProduct.colorVariantProductList[i].colorVariantProductImageList.find(item => item.url == colorVariantProductImage.url) || new ColorVariantProductImage());
    this.baseProduct.colorVariantProductList[i].colorVariantProductImageList = this.baseProduct.colorVariantProductList[i].colorVariantProductImageList.filter(item => item.url != colorVariantProductImage.url);
    if(this.baseProduct.base_product_id > 0){
      let nodeReset = document.getElementById(`resetColorVariantProductImages${i}`);
      nodeReset?.classList.remove('button--disabled');
      nodeReset?.removeAttribute('disabled');
      let nodeUpdate = document.getElementById(`updateColorVariantProductImages${i}`);
      nodeUpdate?.classList.remove('button--disabled');
      nodeUpdate?.removeAttribute('disabled');
    }
    this.colorVariantProductValidForm();
  }
  addCategory(){
    const categoryName: string = this.categoryList.find(item => item.category_id == +this.selectedCategory)?.name || '';
    console.log('lenguaje pa raro: ', categoryName);
    const optionNode = document.getElementById(`${categoryName}`);
    console.log(optionNode);
    optionNode?.setAttribute('disabled', 'true');
    this.baseProduct.categoryList.push(new Category(+this.selectedCategory,categoryName));
  }
  removeCategory(category: Category){
    const optionNode = document.getElementById(`${category.name}`);
    optionNode?.removeAttribute('disabled');
    this.selectedCategory = '';
    this.baseProduct.categoryList = this.baseProduct.categoryList.filter(item => item.category_id != category.category_id);
    if(this.baseProduct.base_product_id > 0){
      let node = document.getElementById('resetBaseProduct');
      node?.classList.remove('button--disabled');
      node?.removeAttribute('disabled');
      let nodeBaseProduct = document.getElementById('updateBaseProduct');
      nodeBaseProduct?.classList.remove('button--disabled');
      nodeBaseProduct?.removeAttribute('disabled');
    }
  }
  createProduct(){    
    let brand = new Brand();
    brand.brand_id = +this.selectedBrand;
    this.baseProduct.brand = brand;

    const baseProductCopy = new BaseProduct();
    baseProductCopy.name = this.baseProduct.name;
    baseProductCopy.base_price = this.baseProduct.base_price;
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
                for(let j = 0; j < this.baseProduct.colorVariantProductList[i].finalProductList.length - 1; j++){
                  const finalProductCopy = new FinalProduct();
                  finalProductCopy.colorVariantProduct = response;
                  const size = new Size();
                  size.size_id = this.baseProduct.colorVariantProductList[i].finalProductList[j].size.size_id;
                  finalProductCopy.size = size;
                  finalProductCopy.final_price = this.baseProduct.colorVariantProductList[i].finalProductList[j].final_price;
                  finalProductCopy.stock = this.baseProduct.colorVariantProductList[i].finalProductList[j].stock;
                  this.finalProductService.create(finalProductCopy).subscribe({
                    next: response=>{
                      console.log('Producto final agregado con exito!, estoy en el indice j: ', j);
                      if(i == this.baseProduct.colorVariantProductList.length - 1 && j == this.baseProduct.colorVariantProductList[i].finalProductList.length - 2){
                        alert('Producto agregado con exito!');
                        this.router.navigate(['/admin_panel/0',0])
                      }
                    }
                  })
                }
              }
            })
        }
      }
    })
  }

  //Metodos de actualizacion de producto

  restartBaseProduct(){
    let node = document.getElementById('resetBaseProduct');
    node?.classList.add('button--disabled');
    node?.setAttribute('disabled','true');
    let nodeBaseProduct = document.getElementById('updateBaseProduct');
    nodeBaseProduct?.classList.add('button--disabled');
    nodeBaseProduct?.setAttribute('disabled','true');
    this.baseProduct = {
      ... this.baseProductOriginal,
      categoryList : [...this.categoryListOriginal],
      baseProductImageList: [... this.baseProductImageListOriginal]};
    this.selectedBrand = this.brandOriginal.brand_id + '';
    this.addImageList = [];
    this.removeImageList = [];
    this.cleanCategoryListArea();
    
    }
  onChangeBaseProduct(event: Event){
    let node = document.getElementById('resetBaseProduct');
    node?.classList.remove('button--disabled');
    node?.removeAttribute('disabled');
    let nodeBaseProduct = document.getElementById('updateBaseProduct');
    nodeBaseProduct?.classList.remove('button--disabled');
    nodeBaseProduct?.removeAttribute('disabled');
  }

  updateBaseProduct(){
    console.log('Esto es lo que se va a enviar: ', this.baseProduct);
    const brand = new Brand();
    brand.brand_id = +this.selectedBrand;
    this.baseProduct.brand = brand;
    this.baseProductService.updateBaseProduct(this.baseProduct, this.baseProduct.base_product_id).subscribe({
      next: response => {
        console.log('Actualizado con exito:', response);
      }
    })
    for(let img of this.removeImageList){
      this.baseProductService.removeBaseProductImage(img, this.baseProduct.base_product_id).subscribe({
        next: response =>{
          console.log('Imagen eliminada', response);
        }
      })
    }
    for(let img of this.addImageList){
      this.baseProductService.addBaseProductImage(img, this.baseProduct.base_product_id).subscribe({
        next: response =>{
          console.log('Imagen agregada', response);
        }
      })
    }

  }

  restartColorVariantProduct(index: number){
    this.baseProduct.colorVariantProductList[index].color.color_id = this.colorVariantProductListOriginal[index].color.color_id;
    this.baseProduct.colorVariantProductList[index].colorVariantProductImageList = this.deepClone(this.colorVariantProductListOriginal[index].colorVariantProductImageList);
    this.addColorVariantProductImageList = [];
    this.removeColorVariantProductImageList = [];
    let nodeReset = document.getElementById(`resetColorVariantProductImages${index}`);
    nodeReset?.classList.add('button--disabled');
    nodeReset?.setAttribute('disabled', 'true');
    let nodeUpdate = document.getElementById(`updateColorVariantProductImages${index}`);
    nodeUpdate?.classList.add('button--disabled');
    nodeUpdate?.setAttribute('disabled','true');
  }

  updateColorVariantProduct(index: number){
    this.colorVariantProductService.updateBaseProduct(this.baseProduct.colorVariantProductList[index], this.baseProduct.colorVariantProductList[index].color_variant_product_id).subscribe({
      next: response =>{
        console.log('ColorVariantProduct actualizado con exito', response);
      }
    })
    for(let img of this.removeColorVariantProductImageList){
      this.colorVariantProductService.romoveColorVariantProductImage(img, this.baseProduct.colorVariantProductList[index].color_variant_product_id).subscribe({
        next: response =>{
          console.log('Imagen removida con exito!');
        }
      })
    }
    for(let img of this.addColorVariantProductImageList){
      this.colorVariantProductService.addColorVariantProductImage(img, this.baseProduct.colorVariantProductList[index].color_variant_product_id).subscribe({
        next: response =>{
          console.log('Imagen agregada con exito!');
        }
      })
    }
  }

  addColorVariantProduct(index: number){
    const colorVariantProductCopy = new ColorVariantProduct();
    const baseProduct = new BaseProduct();
    baseProduct.base_product_id = this.baseProduct.base_product_id;
    colorVariantProductCopy.baseProduct = baseProduct;
    colorVariantProductCopy.colorVariantProductImageList = [...this.baseProduct.colorVariantProductList[index].colorVariantProductImageList];
    const color = new Color();
    color.color_id = this.baseProduct.colorVariantProductList[index].color.color_id;
    colorVariantProductCopy.color = color;
    this.colorVariantProductService.create(colorVariantProductCopy).subscribe({
      next: response =>{
        console.log('Variacion de color agregada con exito!', response);
        for(let i = 0 ; i < this.baseProduct.colorVariantProductList[index].finalProductList.length - 1 ; i ++){
          const finalProductCopy = new FinalProduct();
          const colorVariantProduct = new ColorVariantProduct();        
          colorVariantProduct.color_variant_product_id = response.color_variant_product_id;
          finalProductCopy.colorVariantProduct = colorVariantProduct;
          const size = new Size();
          size.size_id = this.baseProduct.colorVariantProductList[index].finalProductList[i].size.size_id;
          finalProductCopy.size = size;
          finalProductCopy.final_price = this.baseProduct.colorVariantProductList[index].finalProductList[i].final_price;
          finalProductCopy.stock = this.baseProduct.colorVariantProductList[index].finalProductList[i].stock;
          this.finalProductService.create(finalProductCopy).subscribe({
            next: response => {
              console.log('Producto final agregado con exito!, indice: ',i);
            }
          })
        }
      }
    })
  }

  restartFinalProduct(index: number){
    this.baseProduct.colorVariantProductList[index].finalProductList = this.deepClone(this.colorVariantProductListOriginal[index].finalProductList);
    this.disableResetUpdateInvetoryButtons(index);
  }

  updateInventory(index: number){
    for(let i = 0; i < this.colorVariantProductListOriginal[index].finalProductList.length - 1; i++){
      console.log('estoy en actualizar, indice: ', i)
      this.finalProductService.update(this.baseProduct.colorVariantProductList[index].finalProductList[i], this.colorVariantProductListOriginal[index].finalProductList[i].final_product_id).subscribe({
        next: response =>{
          console.log('Final product actualizado con exito: ', response);
        }
      })
    }
    for(let i = this.colorVariantProductListOriginal[index].finalProductList.length - 1; i < this.baseProduct.colorVariantProductList[index].finalProductList.length - 1; i++){
      console.log('estoy en agregar, indice: ', i)
      const finalProductCopy = new FinalProduct();
      const colorVariantProduct = new ColorVariantProduct();        
      colorVariantProduct.color_variant_product_id = this.baseProduct.colorVariantProductList[index].color_variant_product_id;
      finalProductCopy.colorVariantProduct = colorVariantProduct;
      const size = new Size();
      size.size_id = this.baseProduct.colorVariantProductList[index].finalProductList[i].size.size_id;
      finalProductCopy.size = size;
      finalProductCopy.final_price = this.baseProduct.colorVariantProductList[index].finalProductList[i].final_price;
      finalProductCopy.stock = this.baseProduct.colorVariantProductList[index].finalProductList[i].stock;
      this.finalProductService.create(finalProductCopy).subscribe({
        next: response =>{
          console.log('final_product agregado con exito!', response);
        }
      })
    }
    
  }

  enableResetUpdateInvetoryButtons(index: number){
    let nodeReset = document.getElementById(`resetInventory${index}`);
    nodeReset?.removeAttribute('disabled');
    nodeReset?.classList.remove('button--disabled');
    let nodeUpdate = document.getElementById(`updateInventory${index}`);
    nodeUpdate?.removeAttribute('disabled');
    nodeUpdate?.classList.remove('button--disabled');
  }
  disableResetUpdateInvetoryButtons(index: number){
    let nodeReset = document.getElementById(`resetInventory${index}`);
    nodeReset?.setAttribute('disabled', 'true');
    nodeReset?.classList.add('button--disabled');
    let nodeUpdate = document.getElementById(`updateInventory${index}`);
    nodeUpdate?.setAttribute('disabled', 'true');
    nodeUpdate?.classList.add('button--disabled');
  }
  onChangeInventory(colorVariantProduct: ColorVariantProduct){
    let i = this.baseProduct.colorVariantProductList.indexOf(colorVariantProduct);
    console.log('cambio el intentario i: ', i)
    this.enableResetUpdateInvetoryButtons(i);
  }

  colorVariantProductValidForm(){
    console.log('funcion linda');
    let invalid: boolean = false;
    for(let colorVariantProduct of this.baseProduct.colorVariantProductList){
      if(colorVariantProduct.color.color_id == undefined){
        invalid = true;
      }
      if(colorVariantProduct.colorVariantProductImageList != undefined){
        if(colorVariantProduct.colorVariantProductImageList.length == 0){
          invalid = true;
        }
      }else{
        invalid = true;
      }
      
      if(colorVariantProduct.finalProductList.length <= 1){
        invalid = true
      }
    }
    this.finalProductListInvalid = invalid;
  }
  cleanForm(){
    this.baseProduct = new BaseProduct();
    this.baseProduct.categoryList = [];
    this.baseProduct.baseProductImageList = [];
    let finalProduct = new FinalProduct();
    finalProduct.final_product_id = 1;
    finalProduct.size = new Size();
    let colorVariantProduct = new ColorVariantProduct();
    colorVariantProduct.color_variant_product_id = 1;
    colorVariantProduct.color = new Color();
    colorVariantProduct.finalProductList = [finalProduct];
    this.baseProduct.colorVariantProductList = [colorVariantProduct];
    this.cleanCategoryListArea();
  }
  cleanCategoryListArea(){
    for(let category of this.categoryList){
      const optionNode = document.getElementById(`${category.name}`);
      optionNode?.removeAttribute('disabled');
    }
    if(this.baseProduct.base_product_id > 0){
      for(let category of this.baseProductOriginal.categoryList){
        const optionNode = document.getElementById(`${category.name}`);
        optionNode?.setAttribute('disabled', 'true');
      }
    }
    this.selectedCategory = '';
  }
  deepClone<T>(obj: T): T {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }
  
    if (Array.isArray(obj)) {
      const copy: any[] = [];
      obj.forEach((_, i) => {
        copy[i] = this.deepClone(obj[i]);
      });
      return copy as T;
    }
  
    if (obj instanceof Object) {
      const copy: { [key: string]: any } = {};
      Object.keys(obj).forEach(key => {
        copy[key] = this.deepClone((obj as { [key: string]: any })[key]);
      });
      return copy as T;
    }
  
    throw new Error('Unable to copy object! Its type isn\'t supported.');
  }

}

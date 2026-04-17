import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Brand } from '../../../models/general.model'; 
import { ActivatedRoute, RouterModule } from '@angular/router';
import { BrandService } from '../../../services/brand.service';
import { CommonModule } from '@angular/common';
import { Color } from '../../../models/general.model'; 
import { ColorService } from '../../../services/color.service';
import { Size } from '../../../models/general.model'; 
import { SizeService } from '../../../services/size.service';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../models/general.model'; 
import { firstValueFrom } from 'rxjs';
import { BaseProductService } from '../../../services/base-product.service';

@Component({
  selector: 'product',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './product.component.html'
})
export class ProductComponent implements OnInit {
  base_product_id!: number
  productForm!: FormGroup
  brandList: Brand[] = []
  colorList: Color[] = []
  sizeList: Size[] = []
  categoryList: Category[] = []
  get colorVariants(): FormArray { return this.productForm.get('colorVariantProductList') as FormArray }
  get baseProductImages() { return this.productForm.get('baseProductImagesURL') as FormArray }



  constructor(
    private route: ActivatedRoute,
    private brandService: BrandService,
    private colorService: ColorService,
    private sizeService: SizeService,
    private categoryService: CategoryService,
    private fb: FormBuilder,
    private baseProductService: BaseProductService
  ) { }



  async ngOnInit(): Promise<void> {
    const base_product_id: number = +(this.route.snapshot.paramMap.get('base_product_id') || '0')
    this.base_product_id = base_product_id
    
    this.brandService.getAll().subscribe({ next: response => this.brandList = response })
    this.colorService.getAll().subscribe({ next: response => this.colorList = response })
    this.sizeService.getAll().subscribe({ next: response => this.sizeList = response })
    this.categoryService.getAll().subscribe({ next: response => this.categoryList = response })
    this.initForm()
    this.listenBasePriceChanges();

    const data = (this.base_product_id > 0) ?  await this.getProductDetail(base_product_id) : null
    if(data) this.patchProductForm(data)
  }

  patchProductForm(data: any) {
  this.colorVariants.clear();
  this.baseProductImages.clear();

  if (data.baseProductImagesURL) {
    data.baseProductImagesURL.forEach((url: string) => {
      this.baseProductImages.push(this.fb.control(url, Validators.required));
    });
  }
  if (data.colorVariantProductList) {
    data.colorVariantProductList.forEach((variant: any) => {
      const imagesArray = this.fb.array(
        variant.colorVariantProductImagesURL.map((url: string) => this.fb.control(url, Validators.required)),
        Validators.required
      );

      const finalProductsArray = this.fb.array(
        variant.finalProductList.map((fp: any) => this.fb.group({
          stock: [fp.stock, [Validators.required, Validators.min(0)]],
          final_price: [fp.final_price, [Validators.required, Validators.min(1)]],
          size_id: [fp.size_id, Validators.required]
        }))
      );

      const variantForm = this.fb.group({
        color_id: [variant.color_id, Validators.required],
        colorVariantProductImagesURL: imagesArray,
        finalProductList: finalProductsArray
      });

      this.colorVariants.push(variantForm);
    });
  }

  this.productForm.patchValue(data);
}

  async getProductDetail(base_product_id: number): Promise<any | null>{
    try {
      const res = await firstValueFrom(this.baseProductService.findProductAdminById(base_product_id))
      console.log('getProductDetail', res)
      return res
    } catch (error) {
      return null
    }
  }

  async createProduct(){
    const payload = this.productForm.value;
    try {
      const res = await firstValueFrom(this.baseProductService.create(payload))
      console.log(res)
    } catch (error) {
      console.error('error en createProduct', error)
    }
  }


  private listenBasePriceChanges() {
    this.productForm.get('base_price')?.valueChanges.subscribe(newPrice => {
      this.updateAllFinalPrices(newPrice);
    });
  }

  private updateAllFinalPrices(price: number) {
    this.colorVariants.controls.forEach((variant) => {
      const finalProducts = variant.get('finalProductList') as FormArray;

      finalProducts.controls.forEach(product => {
        product.patchValue({ final_price: price }, { emitEvent: false });
      });
    });
  }

  initForm() {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      base_price: ['', [Validators.required, Validators.min(1)]],
      chars: [''],
      specs: [''],
      brand_id: [null, Validators.required],
      baseProductImagesURL: this.fb.array([], Validators.required),
      categories_id: [[], Validators.required],
      colorVariantProductList: this.fb.array([])
    });
    this.addColorVariant()
  }

  addColorVariant() {
    const variantForm = this.fb.group({
      color_id: [null, Validators.required],
      colorVariantProductImagesURL: this.fb.array([], Validators.required),
      finalProductList: this.fb.array([
        this.createFinalProductGroup()
      ])
    });
    this.colorVariants.push(variantForm);
  }

  private createFinalProductGroup(): FormGroup {
    return this.fb.group({
      stock: [0, [Validators.required, Validators.min(0)]],
      final_price: [0, [Validators.required, Validators.min(1)]],
      size_id: [null, Validators.required]
    });
  }

  addFinalProduct(variantIndex: number) {
    const finalProductForm = this.fb.group({
      stock: [0, [Validators.required, Validators.min(0)]],
      final_price: [0, [Validators.required, Validators.min(1)]],
      size_id: [null, Validators.required]
    });
    const finalProducts = this.colorVariants.at(variantIndex)!.get('finalProductList') as FormArray;
    if (finalProductForm) finalProducts.push(finalProductForm);
  }

  addCategory(event: any) {
    const id = Number(event.target.value);
    const current = this.productForm.get('categories_id')?.value || [];
    if (!current.includes(id)) {
      this.productForm.get('categories_id')?.setValue([...current, id]);
    }
  }

  removeCategory(id: number) {
    const current = this.productForm.get('categories_id')?.value || [];
    if (current.includes(id)) {
      const currentWithout = current.filter((item: any) => item != id)
      this.productForm.get('categories_id')?.setValue([...currentWithout]);
    }
  }

  getCategoryName(categoryId: number): string {
    if (!this.categoryList || this.categoryList.length === 0) return '...'
    const category = this.categoryList.find(c => c.category_id === categoryId);
    return category ? category.name : `ID: ${categoryId}`;
  }

  addImage(value: any) {
    const url = (typeof value === 'string') ? value.trim() : value?.target?.value?.trim();
    if (!url) return
    const imagesArray = this.productForm.get('baseProductImagesURL') as FormArray;
    imagesArray.push(this.fb.control(url));
  }

  removeImage(index: number) {
    const imagesArray = this.productForm.get('baseProductImagesURL') as FormArray;
    imagesArray.removeAt(index)
  }

  getVariantImages(variantIndex: number) {
    return this.colorVariants.at(variantIndex).get('colorVariantProductImagesURL') as FormArray;
  }

  getFinalProducts(variantIndex: number) {
    return this.colorVariants.at(variantIndex).get('finalProductList') as FormArray;
  }

  addVariantImage(variantIndex: number, url: string) {
    if (!url) return;
    this.getVariantImages(variantIndex).push(this.fb.control(url));
  }

  addFinalProductRow(variantIndex: number) {
    const finalProductGroup = this.fb.group({
      size_id: [null, Validators.required],
      final_price: [0, [Validators.required, Validators.min(1)]],
      stock: [0, [Validators.required, Validators.min(0)]]
    });
    this.getFinalProducts(variantIndex).push(finalProductGroup);
  }



  removeColorVariant(index: number) {
    this.colorVariants.removeAt(index)
  }

  removeVariantImage(colorIndex: number, imageIndex: number) {
    const imagesArray = this.getVariantImages(colorIndex)
    imagesArray.removeAt(imageIndex)
    console.log(`Imagen ${imageIndex} eliminada de la variante ${colorIndex}`)
  }

  removeFinalProductRow(colorIndex: number, finalProductIndex: number) {
    const finalProducts = this.getFinalProducts(colorIndex);
    if (finalProducts.length > 1) {
      finalProducts.removeAt(finalProductIndex)
    } else {
      finalProducts.at(0).reset({
        size_id: null,
        final_price: 0,
        stock: 0
      });
    }
  }

  cleanForm() {
    this.productForm.reset({
      base_product_id: 0,
      name: '',
      base_price: 0,
      chars: '',
      specs: '',
      brand_id: null,
      categories_id: []
    });

    this.baseProductImages.clear()
    this.colorVariants.clear()
    this.addColorVariant()
  }

  onSubmit() {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      this.logFormErrors(this.productForm);
      return;
    }

    const payload = this.productForm.value;
    console.log('JSON Validado:', payload);
    this.createProduct()
  }

  private logFormErrors(group: FormGroup | FormArray) {
    Object.keys(group.controls).forEach(key => {
      const control = (group.controls as any)[key];
      if (control instanceof FormGroup || control instanceof FormArray) {
        this.logFormErrors(control);
      } else if (control.invalid) {
        console.warn(`Error en -> ${key}:`, control.errors);
      }
    });
  }


}

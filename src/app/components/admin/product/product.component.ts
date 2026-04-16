import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Brand } from '../../../models/brand.model';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { BrandService } from '../../../services/brand.service';
import { CommonModule } from '@angular/common';
import { ColorVariantProduct } from '../../../models/color-variant-product.model';
import { Color } from '../../../models/color.model';
import { ColorService } from '../../../services/color.service';
import { Size } from '../../../models/size.model';
import { SizeService } from '../../../services/size.service';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../models/category.model';

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
  colorVariantProductListOriginal: ColorVariantProduct[] = []
  get colorVariants(): FormArray { return this.productForm.get('colorVariantProductList') as FormArray }
  get baseProductImages() { return this.productForm.get('baseProductImagesURL') as FormArray }



  constructor(
    private route: ActivatedRoute,
    private brandService: BrandService,
    private colorService: ColorService,
    private sizeService: SizeService,
    private categoryService: CategoryService,
    private fb: FormBuilder
  ) { }



  ngOnInit(): void {
    const base_product_id: number = +(this.route.snapshot.paramMap.get('base_product_id') || '0')
    this.base_product_id = base_product_id
    this.brandService.getAll().subscribe({ next: response => this.brandList = response })
    this.colorService.getAll().subscribe({ next: response => this.colorList = response })
    this.sizeService.getAll().subscribe({ next: response => this.sizeList = response })
    this.categoryService.getAll().subscribe({ next: response => this.categoryList = response })
    this.initForm()
  }

  initForm() {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      base_price: ['', [Validators.required, Validators.min(1)]],
      chars: [''],
      specs: [''],
      brand_id: [null, Validators.required],
      baseProductImagesURL: this.fb.array([]),
      categories_id: [[], Validators.required],
      colorVariantProductList: this.fb.array([])
    });
  }

  addColorVariant() {
    const variantForm = this.fb.group({
      color_id: [null, Validators.required],
      colorVariantProductImagesURL: this.fb.array([]),
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




  verComoVa() {
    console.log('Objeto listo para enviar a Java:', this.productForm.value);
  }

  onSubmit() {
    if (this.productForm.valid) {
      console.log('Objeto listo para enviar a Java:', this.productForm.value);
      // Aquí el objeto this.productForm.value ya tiene la forma de tu clase CreateBaseProduct
    }
  }


}

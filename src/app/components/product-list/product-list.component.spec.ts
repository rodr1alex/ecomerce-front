/// <reference types="jasmine" />

import { EventEmitter } from '@angular/core';
import { convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { ProductListComponent } from './product-list.component';
import { BasicProductInfo, Brand, Page } from '../../models/general.model';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let routeMock: { paramMap: any };
  let baseProductServiceMock: { filter: jasmine.Spy; getBrandList: jasmine.Spy };
  let sharingDataServiceMock: { breadcrumbCategoriesEventEmitter: EventEmitter<string[]> };

  beforeEach(() => {
    const paginator = new Page<BasicProductInfo>();
    const brand = new Brand();
    brand.id = 10;
    brand.name = 'Nike';

    routeMock = {
      paramMap: of(convertToParamMap({ category: '3', subcategory: '9' }))
    };

    baseProductServiceMock = {
      filter: jasmine.createSpy('filter').and.returnValue(of(paginator)),
      getBrandList: jasmine.createSpy('getBrandList').and.returnValue(of([brand]))
    };

    sharingDataServiceMock = {
      breadcrumbCategoriesEventEmitter: new EventEmitter<string[]>()
    };

    component = new ProductListComponent(
      routeMock as any,
      baseProductServiceMock as any,
      sharingDataServiceMock as any
    );
  });

  it('should initialize category filters and request data on init', () => {
    spyOn(component, 'getBrandList').and.resolveTo();
    spyOn(component, 'getProductsWithFilters').and.resolveTo();

    component.ngOnInit();

    expect(component.filter.categoriesIds).toEqual([3, 9]);
    expect(component.filter.brandId).toBeNull();
    expect(component.getBrandList).toHaveBeenCalled();
    expect(component.getProductsWithFilters).toHaveBeenCalled();
  });

  it('should compose breadcrumb text with separators', () => {
    component.subcribeBreadCrumb();
    sharingDataServiceMock.breadcrumbCategoriesEventEmitter.emit(['Hombre', 'Zapatillas']);

    expect(component.categoryName).toBe('Hombre / Zapatillas');
  });

  it('should update page and request products when paginator changes', () => {
    spyOn(component, 'getProductsWithFilters').and.resolveTo();

    component.paginatorListener(4);

    expect(component.filter.page).toBe(4);
    expect(component.getProductsWithFilters).toHaveBeenCalled();
  });

  it('should update selected brand and request products', () => {
    spyOn(component, 'getProductsWithFilters').and.resolveTo();

    component.filterByBrandListener(10);

    expect(component.filter.brandId).toBe(10);
    expect(component.getProductsWithFilters).toHaveBeenCalled();
  });

  it('should store products page response', async () => {
    const paginator = new Page<BasicProductInfo>();
    paginator.content = [{ id: 1, name: 'Producto demo' } as any];
    baseProductServiceMock.filter.and.returnValue(of(paginator));

    await component.getProductsWithFilters();

    expect(component.paginator.content.length).toBe(1);
    expect(baseProductServiceMock.filter).toHaveBeenCalledWith(component.filter);
  });
});

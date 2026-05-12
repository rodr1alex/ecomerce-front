/// <reference types="jasmine" />

import { EventEmitter } from '@angular/core';
import { of } from 'rxjs';
import { HomeComponent } from './home.component';
import { BannerImage } from '../../models/general.model';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let baseProductServiceMock: { getFeaturedProducts: jasmine.Spy };
  let sharingDataServiceMock: { showSearchBarEventEmitter: EventEmitter<void> };
  let bannerImageServiceMock: { findAll: jasmine.Spy };

  beforeEach(() => {
    baseProductServiceMock = {
      getFeaturedProducts: jasmine.createSpy('getFeaturedProducts').and.returnValue(of([]))
    };

    sharingDataServiceMock = {
      showSearchBarEventEmitter: new EventEmitter<void>()
    };

    bannerImageServiceMock = {
      findAll: jasmine.createSpy('findAll').and.returnValue(of([new BannerImage('banner-1.jpg')]))
    };

    component = new HomeComponent(
      baseProductServiceMock as never,
      sharingDataServiceMock as never,
      bannerImageServiceMock as never
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit search bar event and load data on init', async () => {
    spyOn(sharingDataServiceMock.showSearchBarEventEmitter, 'emit');
    spyOn(component, 'getBannerImages').and.resolveTo();
    spyOn(component, 'getProducts').and.resolveTo();
    spyOn(window, 'setInterval').and.returnValue(1 as unknown as ReturnType<typeof setInterval>);

    await component.ngOnInit();

    expect(sharingDataServiceMock.showSearchBarEventEmitter.emit).toHaveBeenCalled();
    expect(component.getBannerImages).toHaveBeenCalled();
    expect(component.getProducts).toHaveBeenCalled();
    expect(window.setInterval).toHaveBeenCalled();
  });

  it('should load banner images from service', async () => {
    await component.getBannerImages();

    expect(bannerImageServiceMock.findAll).toHaveBeenCalled();
    expect(component.bannerImageList.length).toBe(1);
    expect(component.bannerImageList[0].url).toBe('banner-1.jpg');
  });

  it('should load featured products from service', async () => {
    await component.getProducts();

    expect(baseProductServiceMock.getFeaturedProducts).toHaveBeenCalled();
    expect(component.baseProductList).toEqual([]);
  });

  it('should move carousel index with next and prev', () => {
    component.bannerImageList = [new BannerImage('1.jpg'), new BannerImage('2.jpg'), new BannerImage('3.jpg')];

    component.currentIndex = 0;
    component.prev();
    expect(component.currentIndex).toBe(2);

    component.next();
    expect(component.currentIndex).toBe(0);

    component.next();
    expect(component.currentIndex).toBe(1);
  });

  it('should handle swipe direction', () => {
    spyOn(component, 'next');
    spyOn(component, 'prev');

    component.touchStartX = 200;
    component.touchEndX = 100;
    component.handleSwipe();

    component.touchEndX = 300;
    component.handleSwipe();

    expect(component.next).toHaveBeenCalled();
    expect(component.prev).toHaveBeenCalled();
  });

  it('should set current index', () => {
    component.setCurrentIndex(3);
    expect(component.currentIndex).toBe(3);
  });
});
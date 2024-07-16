import { AfterViewInit, Component, ElementRef, HostListener, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { BaseProduct } from '../../models/base-product.model';
import { SharingDataService } from '../../services/sharing-data.service';

@Component({
  selector: 'product-card',
  standalone: true,
  imports: [],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent implements OnInit, AfterViewInit{
  @Input() baseProduct!: BaseProduct;
  @ViewChild('dynamicHeightContainer') dynamicHeightContainer!: ElementRef;
  @ViewChild('imgPortrait') imgPortrait!: ElementRef;

  constructor(private renderer: Renderer2, private sharingDataService: SharingDataService) { }

  ngOnInit(): void {
    this.adjustHeight();
  }

  ngAfterViewInit(): void {
    this.adjustHeight();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.adjustHeight();
  }

  private adjustHeight(): void {
    if (this.dynamicHeightContainer) {
      const container = this.dynamicHeightContainer.nativeElement;
      const width = container.offsetWidth;
      container.style.height = `${width * 1.3}px`;
      const imgPortrait = this.imgPortrait.nativeElement;
      const minHeight = width * 0.975;
      this.renderer.setStyle(imgPortrait, 'min-height', `${minHeight}px`);
    }
  }

  clickHanddler(){
    this.sharingDataService.clickrEventEmitter.subscribe(({width, height})=>{
      console.log('Info: ', width, height);
      const container = this.dynamicHeightContainer.nativeElement;
      container.style.height = `${width * 1.3}px`;
      const imgPortrait = this.imgPortrait.nativeElement;
      const minHeight = width * 0.975;
      this.renderer.setStyle(imgPortrait, 'min-height', `${minHeight}px`);
      // if(width > 768){
      //   if(this.clickInFilter){
      //     this.showFilter();
      //     this.clickInFilter = false
      //   }else{
      //     this.hiddeFilter();
      //   }
      // }
    })
  }

  formatCurrency(value: number): string {
    if(value == undefined){
      value = 0;
    }
    return value.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });
  }
  getShortDescription(text: string): string{
    if(text == undefined){
      return ''
    }
    //SE PODRIA OPTIMIZAR A QUE EN DESKTOP SEA 45 O MAS Y MOBILE 35
    if(text.length > 55){
      return text.substring(0, 55) + '...'
    }
    return text;
  }

}

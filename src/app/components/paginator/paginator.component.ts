import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { BaseProductService } from '../../services/base-product.service';
import { SharingDataService } from '../../services/sharing-data.service';
import { AuthService } from '../../services/auth.service';
import { Page } from '../../models/general.model';

@Component({
  selector: 'paginator',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './paginator.component.html'
})
export class PaginatorComponent implements OnChanges{
  @Input() paginator!: Page<any>;
  @Output() pageChanged = new EventEmitter<number>();
  actualPage: number = 0;
  pageList: number[]= [];

  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['paginator']) {
      this.setPageList();
    }
  }
 
  setPageList(){
    if(!this.paginator) return
    this.pageList = [...Array(this.paginator.totalPages).keys()];
  }

  setPage(page: number){
    this.actualPage = page
    this.pageChanged.emit(this.actualPage)
  }

  goToNextPage(){
    if(this.actualPage == this.paginator.totalPages - 1) return
    this.actualPage++
    this.pageChanged.emit(this.actualPage)
  }

  goToPreviousPage(){
    if(this.actualPage == 0) return
    this.actualPage--
    this.pageChanged.emit(this.actualPage)
  }
}

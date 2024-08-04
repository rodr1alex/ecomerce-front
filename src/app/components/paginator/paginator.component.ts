import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { BaseProductService } from '../../services/base-product.service';
import { SharingDataService } from '../../services/sharing-data.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'paginator',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './paginator.component.html'
})
export class PaginatorComponent implements OnChanges{
  @Input() paginator!: any;
  @Input() url: String = '';
  pageList: number[]= [];
  actualPage: number = 0;

  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['paginator']) {
      this.setPageList();
    }
  }
 
  setPageList(){
    if(this.paginator != undefined){
      this.pageList = [];
      for(let i = 0; i < this.paginator.totalPages; i++){
        this.pageList.push(i+1);
      }
    }
    
  }

  setPage(page: number){
    this.actualPage = page;
  }
}

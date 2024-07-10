import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
export class PaginatorComponent implements OnInit{
  paginator!: any;
  url: String = '/product_list'
  pageList: number[]= [];


  constructor(
    private baseProductStore: Store<{baseProducts: any}>,
    private router: Router,
    private route: ActivatedRoute,
    private baseProductService: BaseProductService,
    private sharingDataService: SharingDataService,
    private authService: AuthService) {
      this.baseProductStore.select('baseProducts').subscribe(state =>{
        this.paginator = state.paginator;
        this.setPageList();
      })
  }
  ngOnInit(): void {
    console.log('se cargo compoenente pagunator')
  }

  setPageList(){
    this.pageList = [];
    for(let i = 0; i < this.paginator.totalPages; i++){
      this.pageList.push(i+1);
    }
  }
}

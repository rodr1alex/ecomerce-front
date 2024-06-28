import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'paginator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './paginator.component.html'
})
export class PaginatorComponent {
  pages: number[]= [1,2,3,4];

}

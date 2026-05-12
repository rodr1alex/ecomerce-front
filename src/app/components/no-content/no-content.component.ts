import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'no-content',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './no-content.component.html',
  styleUrls: ['./no-content.component.css']
})
export class NoContentComponent {
  constructor(private location: Location) {}

  goBack(): void {
    this.location.back();
  }
}

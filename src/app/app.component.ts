import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EcomerceAppComponent } from './components/ecomerce-app/ecomerce-app.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, EcomerceAppComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'front-proyecto-ecomerce';
}

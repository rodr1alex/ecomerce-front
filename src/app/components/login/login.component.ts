import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../../models/general.model'; 
import { SharingDataService } from '../../services/sharing-data.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'login',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit{
  user: User;

  constructor(private sharingDataService: SharingDataService, private router: Router) {
    this.user = new User();
  }

  ngOnInit(): void {
  }

  onLogon(){
    if (!this.user.username || !this.user.password) return alert('Credenciales incorrectas!')
    this.sharingDataService.handlerLoginEventEmitter.emit(this.user)
  }

}

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../../models/user.model';
import { SharingDataService } from '../../services/sharing-data.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'login',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  user: User;

  constructor(private sharingData: SharingDataService) {
    this.user = new User();
  }

  onSubmit() {
    if (!this.user.username || !this.user.password) {
      alert('Credenciales incorrectas!');
    } else {
      console.log("Credenciales:", this.user)
      this.sharingData.handlerLoginEventEmitter.emit(this.user);
    }
  }

}

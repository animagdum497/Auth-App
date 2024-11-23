import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  email: string;
  password: string;
  profileType: string;

  constructor(private authService: AuthService, private route: Router) {}

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit() {}
  signup() {
    this.authService.signup(this.email, this.password, this.profileType);
  }
  // async signup(email: string, password: string, profileType: string) {
  //   await this.authService.signup(email, password, profileType);
  //   this.route.navigate(['/home']);
  // }

  login() {
    this.route.navigate(['login']);
  }
}

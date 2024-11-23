import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Router } from '@angular/router';
import { ViewDidEnter } from '@ionic/angular';
import { Profile } from 'src/app/model/profile';
import { User } from 'src/app/model/user';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit , ViewDidEnter{
  email: string;
  password: string;
  cachedProfile: Profile | null = null;

  constructor(
    private authService: AuthService,
    private route: Router,
    private db: AngularFireDatabase
  ) {}

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit() {
    // console.log('ngOnInit called in login page'); // Debugging line
    // this.authService.getUserProfile().subscribe((profile) => {
    //   this.cachedProfile = profile;
    //   console.log('Cached Profile:', this.cachedProfile); // Debugging line
    //   if (this.cachedProfile) {
    //     const profileType = this.cachedProfile.profileType;
    //     console.log('Cached Profile Type:', profileType); // Debugging line
    //     console.log(
    //       'Navigating to:',
    //       profileType === '1' ? '/doctor-home' : '/home'
    //     ); // Debugging line
    //     this.route.navigate([profileType === '1' ? '/doctor-home' : '/home']);
    //   }
    // });
  }

  ionViewDidEnter() {
    //console.log('ionViewDidEnter called in login page'); // Debugging line
    this.authService.getUserProfile().subscribe((profile) => {
      this.cachedProfile = profile;
      console.log('cleard local cache:', this.cachedProfile); // Debugging line
      if (this.cachedProfile) {
        const profileType = this.cachedProfile.profileType;
        // console.log('Cached Profile Type:', profileType); // Debugging line
        // console.log(
        //   'Navigating to:',
        //   profileType === '1' ? '/doctor-home' : '/home'
        // ); // Debugging line
        this.route.navigate([profileType === '1' ? '/doctor-home' : '/home']);
      }
    });
  }
  login() {
    this.authService.login(this.email, this.password);
  }
  register() {
    this.route.navigate(['signup']);
  }
}

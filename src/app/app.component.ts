import { Component } from '@angular/core';
import { Profile } from './model/profile';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/compat/database';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  cachedProfile: Profile | null = null;
  constructor(
    private authService: AuthService,
    private route: Router,
    private db: AngularFireDatabase
  ) {
     console.log('AppComponent called'); // Debugging line

    this.authService.getUserProfile().subscribe((profile) => {
      this.cachedProfile = profile;
      console.log('Cached Profile:', this.cachedProfile); // Debugging line
      if (this.cachedProfile) {
        const profileType = this.cachedProfile.profileType;
        this.route.navigate([profileType === '1' ? '/doctor-home' : '/home']);
      }
    });
  }
}

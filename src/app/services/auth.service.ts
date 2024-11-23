import { Injectable } from '@angular/core';

import { Router } from '@angular/router';
import { Profile } from '../model/profile';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable, of, take } from 'rxjs';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private cachedProfile: Profile | null = null;
  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFireDatabase,
    private router: Router
  ) {}

  async signup(
    email: string,
    password: string,
    profileType: string
  ): Promise<void> {
    try {
      const userCredential = await this.afAuth.createUserWithEmailAndPassword(
        email,
        password
      );
      const uid = userCredential.user?.uid;
      await this.db.object<Profile>(`/profiles/${uid}`).set({
        email: email,
        profileType: profileType,
      });
      this.cachedProfile = { email: email, profileType: profileType };
      localStorage.setItem('cachedProfile', JSON.stringify(this.cachedProfile));
      // console.log('Signup Profile Type:', profileType); // Debugging line
      // console.log(
      //   'Navigating to:',
      //   profileType === '1' ? '/doctor-home' : '/home'
      // ); // Debugging line
      this.router.navigate([profileType === '1' ? '/doctor-home' : '/home']);
    } catch (error) {
      console.error('Error during signup:', error);
    }
  }

  async login(email: string, password: string): Promise<void> {
    try {
      const userCredential = await this.afAuth.signInWithEmailAndPassword(
        email,
        password
      );
      const uid = userCredential.user?.uid;
      const profileSnapshot = await this.db
        .object<Profile>(`/profiles/${uid}`)
        .valueChanges()
        .pipe(take(1))
        .toPromise();
      this.cachedProfile = profileSnapshot as Profile;
      localStorage.setItem('cachedProfile', JSON.stringify(this.cachedProfile));
      const profileType = (profileSnapshot as Profile).profileType;
      this.router.navigate([profileType === '1' ? '/doctor-home' : '/home']);
      //console.log('Login Profile Type:', profileType); // Debugging line
      // console.log(
      //   'Navigating to:',
      //   profileType === '1' ? '/doctor-home' : '/home'
      // ); // Debugging line
    } catch (error) {
      console.error('Error during login:', error);
    }
  }

  async logout(): Promise<void> {
    try {
      await this.afAuth.signOut();
      localStorage.removeItem('cachedProfile');
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }

  getUserProfile(): Observable<Profile | null> {
    const cachedProfile = localStorage.getItem('cachedProfile');
    if (cachedProfile) {
      return of(JSON.parse(cachedProfile));
    }
    return of(null);
  }
}

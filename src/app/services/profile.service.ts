import { Injectable } from '@angular/core';

import { AuthService } from './auth.service';

import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Profile } from '../model/profile';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(
    private db: AngularFireDatabase,
    private authService: AuthService
  ) {}

  // getProfile(): Observable<Profile | null> {
  //   return this.authService.getUser().pipe(
  //     switchMap((user) => {
  //       if (user) {
  //         return this.db
  //           .object<Profile>(`/profiles/${user.uid}`)
  //           .valueChanges();
  //       } else {
  //         return of(null);
  //       }
  //     })
  //   );
  // }
}

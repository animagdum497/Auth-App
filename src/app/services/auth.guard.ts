import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
  Route,
  UrlSegment,
  GuardResult,
  MaybeAsync,
} from '@angular/router';
import { Observable, of } from 'rxjs';

import { map, switchMap, take } from 'rxjs/operators';
import { Profile } from '../model/profile';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private db: AngularFireDatabase
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    return this.afAuth.authState.pipe(
      take(1),
      switchMap((user) => {
        if (user) {
          const uid = user.uid;
          return this.db
            .object(`/profiles/${uid}`)
            .valueChanges()
            .pipe(
              take(1),
              map((profile) => {
                if (profile) {
                  const profileType = (profile as Profile).profileType;

                  console.log('AuthGuard Profile Type:', profileType); // Debugging line
                  console.log('Requested URL:', state.url); // Debugging line

                  if (state.url === '/home' && profileType === '1') {
                    console.log('Redirecting to doctor-home');
                    return this.router.parseUrl('/doctor-home');
                  } else if (
                    state.url === '/doctor-home' &&
                    profileType === '2'
                  ) {
                    console.log('Redirecting to home'); // Debugging line
                    return this.router.parseUrl('/home');
                  }
                  return true;
                } else {
                  this.router.navigate(['/login']);
                  return false;
                }
              })
            );
        } else {
          this.router.navigate(['/login']);
          return of(false);
        }
      })
    );
  }
  canLoad(
    route: Route,
    segments: UrlSegment[]
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.afAuth.authState.pipe(
      take(1),
      map((user) => {
        if (user) {
          return true; // User is authenticated, allow loading the route
        } else {
          return this.router.parseUrl('/login'); // User is not authenticated, redirect to login
        }
      })
    );
  }
}

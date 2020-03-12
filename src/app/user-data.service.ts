import { Injectable } from '@angular/core';
import {of, Observable} from 'rxjs';
import {tap, delay} from 'rxjs/operators';

import {User} from './model';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  constructor() { }

  get currentUser(): Observable<User> {
    return of({
      name: 'Serhii',
      favoriteBandId: '96fafcd8-a7d5-40ed-8252-8111bc081dff'
    }).pipe(
      tap(_ => console.log('Fetching user data started')),
      delay(1000),
      tap(_ => console.log('Fetching user data finishing'))
    );
  }
}

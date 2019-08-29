import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiHandlerService {

  private currentUser = new BehaviorSubject(JSON.parse(localStorage.getItem('currentUser')));
  public currentUser$ = this.currentUser.asObservable();

  constructor(private http: HttpClient) {}

  currentUserValue() {
    return this.currentUser.getValue();
  }

  login(login: string, password: string) {
    return this.http.post('authUrl', {login, password}).pipe(
      map((user: any) => {
        // login successful if there is token in the response
        if (user && user.token) {
            // store user details and token in local storage to keep user logged in between page refreshes
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.currentUser.next(user);
        }
        return user;
      })
    );
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUser.next(null);
  }

  getBoards(): Observable<any>  {
    return this.http.get<any>('boardsUrl', {
      params: this.currentUser.getValue()
    });
  }

  createNewBoard(data): Observable<any> {
    return this.http.post('newBoardUrl', data, {
      params: this.currentUser.getValue(),
      reportProgress: true
    });
  }

  editBoard(data): Observable<any> {
    return this.http.put('editBoardUrl', data, {
      params: this.currentUser.getValue(),
      reportProgress: true
    });
  }

  deleteBoard(data): Observable<any> {
    return this.http.put('deleteBoardUrl', data, {
      params: this.currentUser.getValue(),
      reportProgress: true
    });
  }

  updateBoardOrder(data): Observable<any> {
    return this.http.put('updateBoardOrderUrl', data, {
      params: this.currentUser.getValue(),
      reportProgress: true
    });
  }

  getBoard(hash): Observable<any> {
    return this.http.get('boardUrl' + '/' + hash , {
      params: this.currentUser.getValue()
    });
  }

  createNewCard(data): Observable<any> {
    return this.http.put('newCardUrl', data, {
      params: this.currentUser.getValue(),
      reportProgress: true
    });
  }

  addCardField(data): Observable<any> {
    return this.http.put('addCardFieldUrl', data, {
      params: this.currentUser.getValue(),
      reportProgress: true
    });
  }

  deleteCardField(data): Observable<any> {
    return this.http.put('deleteCardFieldUrl', data, {
      params: this.currentUser.getValue(),
      reportProgress: true
    });
  }

  deleteCard(data): Observable<any> {
    return this.http.put('deleteCardUrl', data, {
      params: this.currentUser.getValue(),
      reportProgress: true
    });
  }

  editCard(data): Observable<any> {
    return this.http.put('editCardUrl', data, {
      params: this.currentUser.getValue(),
      reportProgress: true
    });
  }

  updateCardOrder(data): Observable<any> {
    return this.http.put('updateCardOrderUrl', data, {
      params: this.currentUser.getValue(),
      reportProgress: true
    });
  }

  updateFieldPostion(data): Observable<any> {
    return this.http.put('updateFieldPositionUrl', data, {
      params: this.currentUser.getValue(),
      reportProgress: true
    });
  }
}

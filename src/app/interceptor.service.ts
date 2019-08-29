import { Injectable } from '@angular/core';
import { HttpResponse, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';

import { Observable, of, throwError } from 'rxjs';

import { BOARDS } from './mock-boards';
import { BOARDS_CONTENT } from './mock-boards-content';
import { USER } from './mock-user';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

  boards = BOARDS;
  boardsContent = BOARDS_CONTENT;

  constructor() {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    // the arguments should be checked before being used to avoid error if they are wrong
    const { url, method, headers, body, params } = req;
    const boards = this.boards;
    const boardsContent = this.boardsContent;

    if (url.endsWith('authUrl') && method === 'POST') {
      return auth();
    } else {
      return checkToken(params.get('user'), params.get('token')) ?
        routes() :
        throwError({ status: 401, error: { message: 'Unauthorised' } });
    }

    function routes()  {
      switch (true) {
        case url.endsWith('boardsUrl') && method === 'GET':
          return fetchBoards();
        case url.endsWith('newBoardUrl') && method === 'POST':
          return newBoard();
        case url.endsWith('editBoardUrl') && method === 'PUT':
          return editBoard();
        case url.endsWith('deleteBoardUrl') && method === 'PUT':
          return deleteBoard();
        case url.endsWith('updateBoardOrderUrl') && method === 'PUT':
            return updateBoardOrder();
        case url.split('/')[0].endsWith('boardUrl') && method === 'GET':
          return fetchBoard();
        case url.endsWith('newCardUrl') && method === 'PUT':
          return newCard();
        case url.endsWith('addCardFieldUrl') && method === 'PUT':
          return addCardField();
        case url.endsWith('deleteCardFieldUrl') && method === 'PUT':
          return deleteCardField();
        case url.endsWith('deleteCardUrl') && method === 'PUT':
          return deleteCard();
        case url.endsWith('editCardUrl') && method === 'PUT':
          return editCard();
        case url.endsWith('updateCardOrderUrl') && method === 'PUT':
          return updateCardOrder();
        case url.endsWith('updateFieldPositionUrl') && method === 'PUT':
          return updateFieldPosition();
        default:
          return done();
      }
    }

    function auth() {
      if (body.login === USER.login && body.password === USER.password) {
        return done({user: body.login, token: 'token'});
      } else {
        return throwError({ status: 401, error: { message: 'Unauthorised' } });
      }
    }

    function checkToken(user, token) { // should be something more elaborate in a real app
      return user === USER.login && token === 'token' ? true : false;
    }

    // everytime I use the JSON.stringify()/JSON.parse() to avoid a shallow copy of object in order to simulate the backend
    function fetchBoards() {
      return done(JSON.stringify(boards));
    }

    function newBoard() {
      const content = JSON.parse(body);
      boards.push({
        link: content.hash,
        title: content.title,
        subject: content.subject,
      });
      boardsContent[content.hash] = {
        cards: []
      };
      return done();
    }

    function editBoard() {
      const content = JSON.parse(body);
      boards[content.index] = content.board;
      return done();
    }

    function deleteBoard() {
      boards.splice(body.index, 1);
      return done();
    }

    function updateBoardOrder() {
      const cur = boards[body.currentIndex];
      const pre = boards[body.previousIndex];
      boards[body.currentIndex] = pre;
      boards[body.previousIndex] = cur;
      return done();
    }

    function fetchBoard() {
      const hash = url.split('/')[1];
      return done(JSON.stringify(boardsContent[hash]));
    }

    function newCard() {
      const content = JSON.parse(body);
      boardsContent[content.hash].cards.push(content.newCard);
      return done();
    }

    function addCardField() {
      boardsContent[body.hash].cards[body.index].items.push(body.field);
      return done();
    }

    function deleteCardField() {
      boardsContent[body.hash].cards[body.cardIndex].items.splice(body.itemIndex, 1);
      return done();
    }

    function deleteCard() {
      boardsContent[body.hash].cards.splice(body.cardIndex, 1);
      return done();
    }

    function editCard() {
      if (body.edit.name === 'title') {
        boardsContent[body.hash].cards[body.edit.i].title = body.newValue;
      } else {
        boardsContent[body.hash].cards[body.edit.i].items[body.edit.j] = body.newValue;
      }
      return done();
    }

    function updateCardOrder() {
      const cur = boardsContent[body.hash].cards[body.currentIndex];
      const pre = boardsContent[body.hash].cards[body.previousIndex];

      boardsContent[body.hash].cards[body.currentIndex] = pre;
      boardsContent[body.hash].cards[body.currentIndex].index = body.previousIndex;
      boardsContent[body.hash].cards[body.previousIndex] = cur;
      boardsContent[body.hash].cards[body.previousIndex].index = body.currentIndex;

      return done();
    }

    function updateFieldPosition() {
      if (body.preContIndex === body.curContIndex) {
        const cur = boardsContent[body.hash].cards[body.curContIndex].items[body.currentIndex];
        const pre = boardsContent[body.hash].cards[body.curContIndex].items[body.previousIndex];

        boardsContent[body.hash].cards[body.curContIndex].items[body.currentIndex] = pre;
        boardsContent[body.hash].cards[body.curContIndex].items[body.previousIndex] = cur;
      } else {
        boardsContent[body.hash].cards[body.curContIndex].items
        .splice(body.currentIndex, 0, boardsContent[body.hash].cards[body.preContIndex].items.splice(body.previousIndex, 1)[0]);
      }
      return done();
    }

    function done(data?) {
      return of(new HttpResponse({ status: 200, body: data }));
    }

  }

}

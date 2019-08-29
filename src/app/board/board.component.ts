import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { Observable, BehaviorSubject } from 'rxjs';
import { first, switchMap } from 'rxjs/operators';

import { ApiHandlerService } from '../api-handler.service';
import { BOARDCONTENT } from '../interface';
import { ERRORMSG } from '../form-error';

interface EDIT {
  name: string;
  i: number;
  j: number;
}

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

  private board = new BehaviorSubject<BOARDCONTENT>(null);
  private board$: Observable<BOARDCONTENT> = this.board.asObservable();
  private boardHash: string;

  private formControl: FormGroup;
  private title: FormControl;
  private newField: FormControl;
  private onEdit: FormControl;

  private errorMsg = ERRORMSG;

  private edit: EDIT;
  private fieldName: string;

  constructor(
    private route: ActivatedRoute,
    private apiHandlerService: ApiHandlerService,
  ) { }

  ngOnInit() {

    this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        this.boardHash = params.get('boardId');
        return this.apiHandlerService.getBoard(params.get('boardId'));
      }),
      first()
    ).subscribe(x => this.board.next(JSON.parse(x)));

    this.title = new FormControl('', [
      Validators.required,
    ]);
    this.newField = new FormControl('');
    this.onEdit = new FormControl(undefined, [
      Validators.required,
    ]);

    this.formControl = new FormGroup ({
      title: this.title,
      onEdit: this.onEdit
    });
  }

  dropItem(event: CdkDragDrop<string[]>, i: number) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
    this.apiHandlerService.updateFieldPostion({
      hash: this.boardHash,
      preContIndex: event.previousContainer.id,
      curContIndex: event.container.id,
      currentIndex: event.currentIndex,
      previousIndex: event.previousIndex
    }).pipe(first()).subscribe();
  }

  getConnectedList(): any[] {
    return this.board.getValue().cards.map(x => `${x.index}`);
  }

  dropGroup(event: CdkDragDrop<string[]>) {
    const arr = this.board.getValue();
    moveItemInArray(arr.cards, event.previousIndex, event.currentIndex);
    arr.cards[event.previousIndex].index = event.previousIndex;
    arr.cards[event.currentIndex].index = event.currentIndex;
    this.board.next(arr);
    this.apiHandlerService.updateCardOrder({hash: this.boardHash, previousIndex: event.previousIndex, currentIndex: event.currentIndex})
    .pipe(first())
    .subscribe();
  }

  createNewCard() {

    if (this.title.invalid) {
      this.title.markAsTouched();
      return;
    }

    const title = this.formControl.get('title').value;
    const boardContent = this.board.getValue();
    const newCard = {title, index: boardContent.cards.length, items: []};
    boardContent.cards.push(newCard);
    this.board.next(boardContent);
    this.apiHandlerService.createNewCard(JSON.stringify({newCard, hash: this.boardHash}))
    .pipe(first())
    .subscribe();

    this.title.setValue('');
    this.title.markAsUntouched();
  }

  addNewField(i: number) {

    if (this.newField.value.trim() === '') {
      return;
    }
    const boardContent = this.board.getValue();
    boardContent.cards[i].items.push(this.newField.value);
    this.board.next(boardContent);
    this.apiHandlerService.addCardField({hash: this.boardHash, index: i, field: this.newField.value})
    .pipe(first())
    .subscribe();

    this.newField.setValue('');
    this.newField.markAsUntouched();

  }

  deleteField(i: number, j: number) {
    const boardContent = this.board.getValue();
    boardContent.cards[i].items.splice(j, 1);
    this.board.next(boardContent);
    this.apiHandlerService.deleteCardField({hash: this.boardHash, cardIndex: i, itemIndex: j})
    .pipe(first())
    .subscribe();
  }

  editField(i: number, name: string, value: string, j: number) {
    this.onEdit.setValue(value);
    this.fieldName = name === 'title' ? 'title' + i : 'field' + i + j;
    this.edit = {name, i, j};
  }

  registerEdit() {
    if (this.onEdit.invalid) {
      this.onEdit.markAsTouched();
      return;
    }

    const board = this.board.getValue();
    const newValue = this.onEdit.value;

    if (this.edit.name === 'title') {
      board.cards[this.edit.i].title = newValue;
    } else {
      board.cards[this.edit.i].items[this.edit.j] = newValue;
    }

    this.board.next(board);

    this.onEdit.markAsUntouched();
    this.apiHandlerService.editCard({hash: this.boardHash, edit: this.edit, newValue}).pipe(first()).subscribe();
    this.fieldName = null;
    this.edit = null;
  }

  deleteCard(i: number) {
    const board = this.board.getValue();
    board.cards.splice(i, 1);
    this.board.next(board);
    this.apiHandlerService.deleteCard({hash: this.boardHash, cardIndex: i}).pipe(first()).subscribe();
  }
}

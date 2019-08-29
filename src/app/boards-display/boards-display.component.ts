import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

import { Observable, BehaviorSubject } from 'rxjs';
import { first } from 'rxjs/operators';

import { ApiHandlerService } from '../api-handler.service';
import { BOARD } from '../interface';
import { ERRORMSG } from '../form-error';

@Component({
  selector: 'app-boards-display',
  templateUrl: './boards-display.component.html',
  styleUrls: ['./boards-display.component.scss']
})

export class BoardsDisplayComponent implements OnInit, OnDestroy {

  private boards: BehaviorSubject<BOARD[]> = new BehaviorSubject<BOARD[]>(null);
  private boards$: Observable<BOARD[]> = this.boards.asObservable();

  private formControl: FormGroup;
  private title: FormControl;
  private subject: FormControl;
  private onEdit: FormControl;

  private errorMsg: (arg0: string) => string = ERRORMSG;

  private edit: string;
  private fieldName: string;


  constructor(
    private apiHandlerService: ApiHandlerService,
  ) { }

  ngOnInit() {
    this.title = new FormControl('', [
      Validators.required,
    ]);
    this.subject = new FormControl('', [
      Validators.required,
    ]);
    this.onEdit = new FormControl(undefined, [
      Validators.required
    ]);

    this.formControl = new FormGroup ({
      subject: this.subject,
      title: this.title,
      onEdit: this.onEdit
    });

    this.apiHandlerService.getBoards()
    .pipe(first())
    .subscribe((boards: string) => {
      this.boards.next(JSON.parse(boards));
    });
  }

  ngOnDestroy() {

  }

  drop(event: CdkDragDrop<string[]>) {
    const arr = this.boards.getValue();
    moveItemInArray(arr, event.previousIndex, event.currentIndex);
    this.boards.next(arr);
    this.apiHandlerService.updateBoardOrder({previousIndex: event.previousIndex, currentIndex: event.currentIndex})
    .pipe(first())
    .subscribe();
  }

  async createNewBoard() {
    // check if empty title/subject
    if (this.title.invalid || this.subject.invalid) {
      this.title.markAsTouched();
      this.subject.markAsTouched();
      return;
    }

    // generate a hash of the title + subject + timestamp
    const data: any = {
      title: this.formControl.get('title').value,
      subject: this.formControl.get('subject').value,
      date: Date.now()
    };

    async function sha256(message: string) {
      // encode as UTF-8
      const msgBuffer = new TextEncoder().encode(message);
      // hash the message
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
      // convert ArrayBuffer to Array
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      // convert bytes to hex string
      const hashHex = hashArray.map(b => ('00' + b.toString(16)).slice(-2)).join('');
      return hashHex;
    }

    const hash = await sha256(JSON.stringify(data));
    data.hash = hash;

    const boards = this.boards.getValue();
    boards.push({
      link: data.hash,
      title: data.title,
      subject: data.subject,
    });
    this.boards.next(boards);
    data.boards = boards;
    this.apiHandlerService.createNewBoard(JSON.stringify(data)).pipe(first()).subscribe();

    // reset the form
    this.title.setValue('');
    this.subject.setValue('');
    this.title.markAsUntouched();
    this.subject.markAsUntouched();
  }

  editBoard(name: string, value: string, i: number) {
    this.edit = name;
    this.fieldName = name + i;
    this.onEdit.setValue(value);
  }

  registerEdit(i: number) {
    if (this.onEdit.invalid) {
      this.onEdit.markAsTouched();
      return;
    }

    const boards = this.boards.getValue();
    const newValue = this.onEdit.value;
    boards[i][this.edit] = newValue;
    this.boards.next(boards);
    this.edit = null;
    this.fieldName = null;
    this.onEdit.markAsUntouched();

    this.apiHandlerService.editBoard(JSON.stringify({board: boards[i], index: i})).pipe(first()).subscribe();
  }

  deleteBoard(i: number) {
    const boards = this.boards.getValue();
    boards.splice(i, 1);
    this.boards.next(boards);
    this.apiHandlerService.deleteBoard({index: i}).pipe(first()).subscribe();
  }
}

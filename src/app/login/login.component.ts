import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { first } from 'rxjs/operators';

import { ApiHandlerService } from '../api-handler.service';
import { ERRORMSG } from '../form-error';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public formControl: FormGroup;
  public login: FormControl;
  public password: FormControl;

  public error: any;
  public errorMsg = ERRORMSG;

  constructor(
    private router: Router,
    private apiHandlerService: ApiHandlerService,
  ) { }

  ngOnInit() {
    this.login = new FormControl('', [
      Validators.required,
    ]);
    this.password = new FormControl('', [
      Validators.required,
    ]);

    this.formControl = new FormGroup ({
      login: this.login,
      password: this.password
    });
  }

  submit() {
    if (this.login.invalid || this.password.invalid) {
      this.login.markAsTouched();
      this.password.markAsTouched();
      return;
    }

    this.apiHandlerService.login(this.formControl.get('login').value, this.formControl.get('password').value)
    .pipe(first())
    .subscribe(
      data => {
        this.router.navigate(['boards']);
      },
      error => {
        this.error = error.error;
      });
  }
}

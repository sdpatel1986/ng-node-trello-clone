import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { ApiHandlerService } from './api-handler.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  logged: any;
  sub: Subscription;

  constructor(
    private apiHandlerService: ApiHandlerService,
    private router: Router
  ) {}

  ngOnInit() {
    this.sub = this.apiHandlerService.currentUser$.subscribe(x => this.logged = x);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  logout() {
    this.apiHandlerService.logout();
    this.router.navigate(['']);
  }
}

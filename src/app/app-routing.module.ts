import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BoardsDisplayComponent } from './boards-display/boards-display.component';
import { BoardComponent } from './board/board.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth/auth.guard';

// add route for auth
// const routes: Routes = [
//   { path: '', component: LoginComponent },
//   // { path: '', component: BoardsDisplayComponent },
//   { path: 'board/:boardId', component: BoardComponent},
//   { path: '**', redirectTo: '', pathMatch: 'full'}
// ];

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'boards', component: BoardsDisplayComponent, canActivate: [AuthGuard] },
  { path: 'board/:boardId', component: BoardComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

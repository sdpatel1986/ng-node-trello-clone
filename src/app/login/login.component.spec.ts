import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialDesignModule } from '../material-design.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      imports: [
        HttpClientTestingModule,
        BrowserAnimationsModule,
        MaterialDesignModule,
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a section element', () => {
    const HomeElement: HTMLElement = fixture.nativeElement;
    const section = HomeElement.querySelector('section');
    expect(section).toBeTruthy();
  });

  it('should display an error message when user is invalid', () => {
    const Login = fixture.debugElement.componentInstance;
    // directly set the value of error here because if I want to call Login.submit
    // I would have to  create a mock service for ApiHandlerService
    Login.error = { message: 'Unauthorised' };
    fixture.detectChanges();
    const error = fixture.nativeElement.querySelector('#log_error');
    expect(error).toBeTruthy();
    expect(error.innerHTML.trim()).toEqual('Wrong login / password.');
  });
});

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ApiHandlerService } from './api-handler.service';

describe('ApiHandlerService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule
    ]
  }));

  it('should be created', () => {
    const service: ApiHandlerService = TestBed.get(ApiHandlerService);
    expect(service).toBeTruthy();
  });
});

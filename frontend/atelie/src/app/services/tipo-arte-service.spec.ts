import { TestBed } from '@angular/core/testing';

import { TipoArteService } from './tipo-arte-service';

describe('TipoArteService', () => {
  let service: TipoArteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipoArteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

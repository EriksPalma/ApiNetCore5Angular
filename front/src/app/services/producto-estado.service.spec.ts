import { TestBed } from '@angular/core/testing';

import { ProductoEstadoService } from './producto-estado.service';

describe('ProductoEstadoService', () => {
  let service: ProductoEstadoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductoEstadoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

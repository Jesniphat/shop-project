import { TestBed, inject } from '@angular/core/testing';

import { ScrutinizeService } from './scrutinize.service';

describe('ScrutinizeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ScrutinizeService]
    });
  });

  it('should be created', inject([ScrutinizeService], (service: ScrutinizeService) => {
    expect(service).toBeTruthy();
  }));
});

import { TestBed } from '@angular/core/testing';

import { CryptoCompareService } from './crypto-compare.service';

describe('CoinGeckoService', () => {
  let service: CryptoCompareService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CryptoCompareService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

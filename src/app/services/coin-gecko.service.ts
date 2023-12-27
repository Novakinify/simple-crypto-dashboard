import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, interval, startWith, switchMap } from 'rxjs';
import { CryptoMarket } from '../models/crypto-market.model';


@Injectable({
  providedIn: 'root'
})
export class CoinGeckoService {
  private baseUrl = 'https://api.coingecko.com/api/v3';
  private apiKey = 'CG-D8kwrEq3pAs5GneWvgt6GD9X';

  // Do a call to refresh the daya on very 5m, usually this can be done with websockets or realtime DB. In this case we must use this.
  private readonly POLLING_INTERVAL = 300000;

  constructor(private http: HttpClient) { }

  fetchMarketData(): Observable<CryptoMarket[]> {
    const endpoint = '/coins/markets';

    const params = {
      vs_currency: 'usd',
      order: 'market_cap_desc',
      per_page: 15,
      page: 1,
      sparkline: false
    };

    const headers = new HttpHeaders({
      'X-CoinGecko-API-Key': this.apiKey
    });
  
    return interval(this.POLLING_INTERVAL)
      .pipe(
        startWith(0), // To trigger immediate execution at subscription time
        switchMap(() => this.http.get<CryptoMarket[]>(`${this.baseUrl}${endpoint}`, { params, headers }))
      );
  }

  fetchLast24HourData(coinId: string): Observable<any> {
    const to = Math.floor(Date.now() / 1000);
    const from = to - (24 * 60 * 60); // 24 hours ago

    const url = `${this.baseUrl}/coins/${coinId}/market_chart/range`;
    const params = new HttpParams()
      .set('vs_currency', 'usd')
      .set('from', from.toString())
      .set('to', to.toString());

    const headers = new HttpHeaders({
      'X-CoinGecko-API-Key': this.apiKey
    });

    return this.http.get(url, { params, headers });
  }
}

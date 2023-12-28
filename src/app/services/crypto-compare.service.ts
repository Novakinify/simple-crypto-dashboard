import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { CryptoCompareResponse, CryptoMarket } from '../models/crypto-market.model';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class CryptoCompareService {

  constructor(private http: HttpClient) { }

  fetchMarketData(): Observable<CryptoMarket[]> {
    const endpoint = '/data/pricemultifull';
    const symbols = 'BTC,ETH,XRP,DOGE,DOT,LTC,ADA,STETH,AVAX,MATIC,TRX,LINK,SOL,BNB,BCH';
    const url = `${environment.cryptoCompareBaseUrl}${endpoint}?fsyms=${symbols}&tsyms=USD&api_key=${environment.apiKey}`;
  
    return this.http.get<any>(url).pipe(
      map(response => response.RAW),
      catchError(this.handleError<CryptoMarket[]>('fetchMarketData', []))
    );
  }

  fetchHourlyHistoricData(coinSymbol: string, comparisonSymbol: string, hours: number = 24): Observable<any> {
    const endpoint = '/data/v2/histohour'; // Changed to histohour for hourly data
    const limit = hours - 1; // 24 hours will include the current hour, subtract 1 to get the past 24 completed hours
    const params = new HttpParams()
      .set('fsym', coinSymbol)
      .set('tsym', comparisonSymbol)
      .set('limit', limit.toString());

    const url = `${environment.cryptoCompareBaseUrl}${endpoint}?api_key=${environment.apiKey}&${params}`;
  
    return this.http.get(url);
  }
  
  // it extracts the relevant data from the USD object within that entry. 
  transformCryptoCompareData(rawData: CryptoCompareResponse): CryptoMarket[] {
    const transformedData: CryptoMarket[] = [];
  
    for (const [key, value] of Object.entries(rawData)) {
      const data = value.USD;
      transformedData.push({
        symbol: key,
        price: data.PRICE,
        high: data.HIGHDAY,
        low: data.LOWDAY,
        change24Hour: data.CHANGE24HOUR,
        open24Hour: data.OPEN24HOUR,
        mktcap: data.MKTCAP,
        imageUrl: `https://www.cryptocompare.com${data.IMAGEURL}`
      });
    }
  
    return transformedData;
  }

  fetchCoinList(): Observable<any> {
    const coinListUrl = `${environment.cryptoCompareBaseUrl}/data/all/coinlist`;
    return this.http.get(coinListUrl);
  }

  // Generic method used to handle errors
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
  
      this.log(`${operation} failed: ${error.message}`);
  
      // Keep running by returning an empty result.
      return of(result as T);
    };
  }

  private log(message: string) {
    console.log(`CryptoService: ${message}`);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { CryptoCompareResponse, CryptoMarket } from '../models/crypto-market.model';


@Injectable({
  providedIn: 'root'
})
export class CryptoCompareService {
  private cryptoCompareBaseUrl = 'https://min-api.cryptocompare.com';
  private apiKey = 'c66ad3ade96305d9d6fd64fad01b2b3783e01da48e4508d8c6048be820c86165';

  constructor(private http: HttpClient) { }

  fetchMarketData(): Observable<CryptoMarket[]> {
    const endpoint = '/data/pricemultifull';
    const symbols = 'BTC,ETH,XRP,DOGE,DOT,LTC,ADA,STETH,AVAX,MATIC,TRX,LINK,SOL,BNB,BCH';
    const currencies = 'USD';
    const url = `${this.cryptoCompareBaseUrl}${endpoint}?fsyms=${symbols}&tsyms=${currencies}&api_key=${this.apiKey}`;

    return this.http.get<any>(url).pipe(
      map(response => response.RAW)
    );
  }

  fetchHourlyHistoricData(coinSymbol: string, comparisonSymbol: string, hours: number = 24): Observable<any> {
    const endpoint = '/data/v2/histohour'; // Changed to histohour for hourly data
    const limit = hours - 1; // 24 hours will include the current hour, subtract 1 to get the past 24 completed hours
    const params = new HttpParams()
      .set('fsym', coinSymbol)
      .set('tsym', comparisonSymbol)
      .set('limit', limit.toString());
  
    const apiKey = 'c66ad3ade96305d9d6fd64fad01b2b3783e01da48e4508d8c6048be820c86165';
    const url = `${this.cryptoCompareBaseUrl}${endpoint}?api_key=${apiKey}&${params}`;
  
    return this.http.get(url);
  }
  
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
}

import { Component, OnDestroy } from '@angular/core';
import { CryptoCompareService } from './services/crypto-compare.service';
import { CryptoMarket } from './models/crypto-market.model';
import { Subscription } from 'rxjs';
import { style, transition, trigger, animate } from '@angular/animations';
import { LoadingService } from './services/loading.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('cardAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('0.5s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
    ]),
  ]
})

export class AppComponent implements OnDestroy {
  subscription!: Subscription;
  loadingSubscription!: Subscription;
  marketData: CryptoMarket[] = [];
  coinList: any = {};
  loading: boolean = false;

  constructor(private cryptoCompareService: CryptoCompareService,
              public loadingService: LoadingService) {
    // Calling the fetchMarketData() method to fetch the coin market data on page load
    this.initializeLoading();
    this.fetchMarketData();
  }

  title = 'Crypto Dashboard';

  fetchMarketData() {
    this.loadingService.show();
    this.subscription = this.cryptoCompareService.fetchMarketData()
      .subscribe({
        next: (response: any) => {
          // Transform the CryptoCompare data
          const transformedData = this.cryptoCompareService.transformCryptoCompareData(response);
  
          // Fetch the coin list data
          this.cryptoCompareService.fetchCoinList().subscribe((coinListResponse) => {
            if (coinListResponse.Response === 'Success') {
              const coinList = coinListResponse.Data;
  
              // Add full names to the market data
              this.marketData = transformedData.map((coin) => ({
                ...coin,
                fullName: coinList[coin.symbol].CoinName
              }));
            } else {
              console.error('Failed to fetch coin list:', coinListResponse.Message);
            }
  
            this.loadingService.hide();
          });
        },
        error: (error: any) => {
          this.loadingService.hide();
          console.error('Error getting Coin Gecko Data', error);
        }
      });
  }

  trackByFn(item: any) {
    return item.symbol;
  }

  getPercentageColor(percentageChange: number): string {
    // Positive and Negative colors from dark to light
    const positiveColors = ['#424C52', '#415351', '#42594F'];
    const negativeColors = ['#7A4750', '#82484F', '#92484E'];
  
    // Function to determine the color of the cards depending on the High/Low change in price.
    const getRangeColor = (percentage: number, colors: string[]): string => {
      if (percentage > 0 && percentage <= 0.5) {
        return colors[0];
      } else if (percentage > 0.5 && percentage <= 1) {
        return colors[1];
      } else if (percentage > 1) {
        return colors[2];
      } else {
        return colors[0]; // Default return for percentages <= 0
      }
    };
  
    // Determine if the percentage is positive or negative and get the color
    if (percentageChange < 0) {
      return getRangeColor(-1 * percentageChange, negativeColors);
    } else {
      return getRangeColor(percentageChange, positiveColors);
    }
  }

  fetchCoinsList() {
    this.cryptoCompareService.fetchCoinList().subscribe((response) => {
      if (response.Response === 'Success') {
        // Store the coin list data in coinList
        this.coinList = response.Data;
      } else {
        console.error('Failed to fetch coin list:', response.Message);
      }
    });
  }

  initializeLoading() {
    this.loadingSubscription = this.loadingService.isLoading.subscribe((isLoading) => {
      if (isLoading) {
        this.loading = true;
      } else {
        if (this.loading) {
          this.loading = false;
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    if (this.loadingSubscription) {
      this.loadingSubscription.unsubscribe();
    }
  }
}

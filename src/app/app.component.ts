import { Component, OnDestroy } from '@angular/core';
import { CoinGeckoService } from './services/coin-gecko.service';
import { CryptoMarket } from './models/crypto-market.model';
import { Subscription } from 'rxjs';
import { style, transition, trigger, animate } from '@angular/animations';

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
  marketData: CryptoMarket[] = [];

  constructor(private coinGeckoService: CoinGeckoService) {
    // Calling the fetchMarketData() method to fetch the coin market data on page load
    this.fetchMarketData();
  }

  title = 'bittensor';

  fetchMarketData() {
    this.subscription = this.coinGeckoService.fetchMarketData()
    .subscribe({
      next: (response => {
        // Assigning the Coin Market Data fetched from the external API
        this.marketData = response;
      }),
      error: (error => {
        // Not showing errors in a alert or any other visual representation done on purpose. Because of free api calls limit.
        console.log(error, ' Error getting Coin Gecko Data');
      })
    });
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

  // Utility function to format the date, usually I create utility service for handling utility functions.
  formatDateForApi(date: Date): string {
    // Format the date as 'DD-MM-YYYY'
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`
  }
  

  ngOnDestroy(): void {
    // Unsubscribing from the fetchMarketData to prevent any memory leaks
    this.subscription.unsubscribe();
  }
}

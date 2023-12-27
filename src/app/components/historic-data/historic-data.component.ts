import { Component, Input, OnInit, ViewChild, ElementRef, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { CoinGeckoService } from 'src/app/services/coin-gecko.service';
import { Subscription } from 'rxjs';

// Chart.js
import { Chart, registerables  } from 'chart.js';
import 'chartjs-adapter-date-fns';
Chart.register(...registerables);

@Component({
  selector: 'app-historic-data',
  templateUrl: './historic-data.component.html',
  styleUrls: ['./historic-data.component.scss']
})
export class HistoricDataComponent implements OnInit, OnChanges, OnDestroy {
  @Input() coinId: string = '';
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;
  chart: Chart | null = null;

  // Variables used for the historical data
  labels: string[] = [];
  data: number[] = [];

  private dataSubscription!: Subscription;

  constructor(private coinGeckoService: CoinGeckoService) {}

  ngOnInit(): void {
    if (this.coinId) {
      // Calling this method to populate the historical data when the coin id is available
      this.processHistoricData();
    } else {
      console.log('Error: Check coin id when fetching historical data')
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    // Checks if there is a change in the coinId property. Also checks if coindId has value and it's not undefined, null or false
    if (changes['coinId'] && this.coinId) {
      this.processHistoricData();
    }
  }

  ngAfterViewInit() {
    // We create the chart after view init
    this.createChart();
  }

  processHistoricData() {
    // We make sure there is no active subscriptions before we continue to fetch the coins last 24h data
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }

    if (this.coinId) {
      // We call fetchLast24HourData from the coinGeckoService that we created and subscribe to get the data
      this.dataSubscription = this.coinGeckoService.fetchLast24HourData(this.coinId).subscribe(data => {
        // We assign the data separately in labels and data so we can feed the chart.
        this.labels = data.prices.map((price: number[]) => price[0]);
        this.data = data.prices.map((price: number[]) => price[1]);

        if (this.chartCanvas && this.chartCanvas.nativeElement) {
          // We create the chart after chartCanvas element is available
          this.createChart();
        }
      });
    }
  }

  createChart() {
    // If there are existing charts, we cleanup first
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
    
    const context = this.chartCanvas.nativeElement.getContext('2d');

    // If the element is available proceed with drawing the charts
    if (context) {
      this.chart = new Chart(context, {
        type: 'line',
        data: {
          labels: this.labels,
          datasets: [{
            label: 'Price',
            data: this.data,
            backgroundColor: 'rgba(0, 0, 0, 0.0)',
            borderColor: '#FFFFFF', // Line color
            borderWidth: 1,
            pointRadius: 0, // Hide points
            pointBackgroundColor: '#ffffff', // Color for high/low points
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          aspectRatio: 3,
          scales: {
            x: {
              type: 'time', // Ensure the x-axis is treated as a time scale
              time: {
                unit: 'hour',
                tooltipFormat: 'HH:mm', // 24-hour format
                displayFormats: {
                  hour: 'ha', // 12-hour format with am/pm
                },
              },
              display: true,
              grid: {
                display: false, // Hide X-axis gridlines
                offset: false,
                drawOnChartArea: false,
                drawTicks: false,
              },
              border: {
                display: false
              },
              ticks: {
                display: true,
                maxTicksLimit: 6,
                autoSkip: true,
                color: '#FFFFFF',
                align: 'start',
                stepSize: 1,
                autoSkipPadding: 50,
                source: 'data'
              },
              min: this.labels[0],
            },
            y: {
              display: false,
              grid: {
                display: false, // Set to false to hide gridlines
                color: '#dddddd' // Light color for gridlines
              },
            },
          },
          plugins: {
            legend: {
              display: false // Hide the legend
            },
            tooltip: {
              mode: 'index',
              intersect: false,
              callbacks: {
                label: function(context) {
                  let label = context.dataset.label || '';
                  if (label) {
                    label += ': ';
                  }
                  const value = context.parsed.y;
                  label += `$${value.toFixed(2)}`;
                  return label;
                }
              }
            }
          },
          elements: {
            line: {
              tension: 0.3 // Makes the line a bit curved. Set to 0 for straight lines.
            }
          }
        }
      });
    } else {
      console.error('Could not get canvas context');
    }
  }
  
  ngOnDestroy() {
    // Unsubscribe to avoid memory leaks
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

}

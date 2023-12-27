import { Component, Input, OnInit, ViewChild, ElementRef, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { CryptoCompareService } from 'src/app/services/crypto-compare.service';
import { Subscription } from 'rxjs';

// Chart.js
import { Chart, registerables  } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { HistoricData } from 'src/app/models/historic-data.model';
Chart.register(...registerables);

@Component({
  selector: 'app-historic-data',
  templateUrl: './historic-data.component.html',
  styleUrls: ['./historic-data.component.scss']
})
export class HistoricDataComponent implements OnInit, OnChanges, OnDestroy {
  @Input() coinSymbol: string = '';
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;
  chart: Chart | null = null;

  // Variables used for the historical data
  historicData: HistoricData[] = [];

  private dataSubscription!: Subscription;

  constructor(private cryptoCompareService: CryptoCompareService) {}

  ngOnInit(): void {
    if (this.coinSymbol) {
      // Calling this method to populate the historical data when the coin symbol is available
      this.processHistoricData();
    } else {
      console.log('Error: Check coin id when fetching historical data')
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    // Checks if there is a change in the coinId property. Also checks if coindId has value and it's not undefined, null or false
    if (changes['coinId'] && this.coinSymbol) {
      this.processHistoricData();
    }
  }

  ngAfterViewInit() {
    // We create the chart after view init
    this.createChart();
  }

  processHistoricData() {
    this.dataSubscription = this.cryptoCompareService.fetchHourlyHistoricData(this.coinSymbol, 'USD').subscribe({
      next: (response) => {
        // Check if the response has a 'Data' property and that it contains a 'Data' array
        if (response && response.Data && Array.isArray(response.Data.Data)) {
          // Ensure that response.Data.Data is an array
          this.historicData = response.Data.Data;
          this.createChart(); // Create the chart now that the data is confirmed to be an array
        } else {
          // Log an error if the format is not as expected
          console.error('Data is not in expected format:', response);
        }
      },
      error: (error) => {
        console.error('There was an error fetching the historical data', error);
      }
    });
  }

  createChart() {
    // If there are existing charts, we cleanup first
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
    
    const context = this.chartCanvas.nativeElement.getContext('2d');
    const labels = this.historicData.map(data => new Date(data.time * 1000));
    const dataPoints = this.historicData.map(data => data.close); // Use closing price for the chart
    const firstLabel = labels[0] ? labels[0].toISOString() : null;

    // If the element is available proceed with drawing the charts
    if (context && firstLabel) {

      this.chart = new Chart(context, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Price',
            data: dataPoints,
            backgroundColor: 'rgba(0, 0, 0, 0.0)',
            borderColor: '#FFFFFF', // Line color
            borderWidth: 1,
            pointRadius: 0,
            pointBackgroundColor: '#ffffff', // Color for high/low points
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          aspectRatio: 3,
          scales: {
            x: {
              type: 'time', // x-axis is treated as a time scale
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
              min: labels[0].toISOString(),
            },
            y: {
              display: false,
              grid: {
                display: false,
                color: '#dddddd'
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
              tension: 0.1 // Makes the line a bit curved. Set to 0 for straight lines.
            }
          }
        }
      });
    } else {
      console.error('Could not get canvas context');
    }
  }
  
  ngOnDestroy() {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

}

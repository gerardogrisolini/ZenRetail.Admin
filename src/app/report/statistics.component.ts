import { ViewChild, Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SessionService } from './../services/session.service';
import { StatisticService } from './../services/statistic.service';
import { SelectItem, UIChart } from 'primeng/primeng';

@Component({
    selector: 'statistics-component',
    templateUrl: 'statistics.component.html'
})

export class StatisticsComponent implements OnInit {

    @ViewChild('deviceChart') deviceChart: UIChart;
    @ViewChild('saleChart') saleChart: UIChart;
    @ViewChild('totalChart') totalChart: UIChart;
    isBusy: boolean;
    years: SelectItem[];
    selectedYear: number;
    sales: any;
    saleOptions: any;
    devices: any;
    deviceOptions: any;
    totals: any;
    totalOptions: any;

    constructor(
        private sessionService: SessionService,
        private translate: TranslateService,
        private statisticService: StatisticService) {
    }

    ngOnInit() {
        this.sessionService.checkCredentials(true);
        this.sessionService.setTitle('Statistics');

        this.translate.get('Amount for devices').subscribe((res: string) => {
            this.deviceOptions = {
                title: {
                    display: true,
                    text: res
                },
                legend: {
                    position: 'top',
                    labels: {
                        boxWidth: 20
                    }
                }
            }
        });

        this.saleOptions = {
            title: {
                display: true
            },
            legend: {
                position: 'top',
                labels: {
                    boxWidth: 20
                }
            }
        };

        this.totalOptions = {
            title: {
                display: true
            },
            legend: {
                position: 'top',
                labels: {
                    boxWidth: 20
                }
            }
        };

        this.showDevice();
        this.years = [];
        this.selectedYear = new Date().getFullYear();
        for (let i = 2017; i <= this.selectedYear; i++) {
            this.years.push({label: i.toString(), value: i});
        }
        this.showCategory();
    }

    showDevice() {
        this.statisticService.getUseByDeviceAsync().subscribe(result => {
            this.devices = result;
            this.totals = result;
            this.delay(1000).then(() => this.deviceChart.refresh());
        });
    }

    showCategory() {
        this.isBusy = true;
        this.translate.get('Sales for month of top 15 categories').subscribe((res: string) =>
            this.saleOptions.title.text = res);
        this.translate.get('Amount for categories').subscribe((res: string) =>
            this.totalOptions.title.text = res);

        this.statisticService.getCategoryByYearAsync(this.selectedYear).subscribe(result => {
            this.totals = result;
            this.statisticService.getCategoryForMonthByYearAsync(this.selectedYear).subscribe(res => {
                this.sales = res;
                this.refresh();
            });
        });
    }

    showProduct() {
        this.isBusy = true;
        this.translate.get('Sales for month of top 15 products').subscribe((res: string) =>
            this.saleOptions.title.text = res);
        this.translate.get('Amount for products').subscribe((res: string) =>
            this.totalOptions.title.text = res);

        this.statisticService.getProductByYearAsync(this.selectedYear).subscribe(result => {
            this.totals = result;
            this.statisticService.getProductForMonthByYearAsync(this.selectedYear).subscribe(res => {
                this.sales = res;
                this.refresh();
            });
        });
    }

    refresh() {
        this.delay(1000).then(() => {
            this.saleChart.refresh();
            this.totalChart.refresh();
            this.isBusy = false;
        });
    }

    delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

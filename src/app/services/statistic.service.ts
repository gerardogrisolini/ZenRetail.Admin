import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { Helpers } from '../shared/helpers';

@Injectable()
export class StatisticService {

    constructor(private http: HttpClient) {
    }

    getUseByDeviceAsync(): Observable<any> {
        return this.http.get<any>('/api/statistic/device');
    }

    getCategoryByYearAsync(year: number): Observable<any> {
        return this.http.get<any>('/api/statistic/category/' + year);
    }

    getCategoryForMonthByYearAsync(year: number): Observable<any> {
        return this.http.get<any>('/api/statistic/categoryformonth/' + year);
    }

    getProductByYearAsync(year: number): Observable<any> {
        return this.http.get<any>('/api/statistic/product/' + year);
    }

    getProductForMonthByYearAsync(year: number): Observable<any> {
        return this.http.get<any>('/api/statistic/productformonth/' + year);
    }
}

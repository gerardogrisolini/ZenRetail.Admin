import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { Store } from '../shared/models';
import { Helpers } from '../shared/helpers';

@Injectable()
export class CountryService {

    constructor(private http: HttpClient) {
    }

    get(): Observable<Country[]> {
        return this.http.get<Country[]>('https://restcountries.eu/rest/v2/all?fields=alpha3Code;name;currencies;timezones');
    }
}

export interface Country {
    alpha3Code: string;
    name: string;
    currencies: Currency[];
    timezones: string[];
}

export interface Currency {
    code: string;
    name: string;
    symbol: string;
}

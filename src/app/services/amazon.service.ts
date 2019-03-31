import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { MwsRequest, MwsConfig } from '../shared/models';
import { Helpers } from '../shared/helpers';

@Injectable()
export class AmazonService {

    constructor(private http: HttpClient) {
    }

    getConfig(): Observable<MwsConfig> {
        return this.http.get<MwsConfig>('/api/mws/config');
    }

    updateConfig(config: MwsConfig): Observable<MwsConfig> {
        return this.http.put<MwsConfig>('/api/mws/config', config);
    }

    get(): Observable<MwsRequest[]> {
        return this.http.get<MwsRequest[]>('/api/mws');
    }

    getByRange(start: number, finish: number): Observable<MwsRequest[]> {
        return this.http.get<MwsRequest[]>('/api/mws/' + start + '/' + finish);
    }

    delete(id: string): Observable<any> {
        return this.http.delete<any>('/api/mws/' + id);
    }
}

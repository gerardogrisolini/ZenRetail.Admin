import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { Store } from '../shared/models';
import { Helpers } from '../shared/helpers';

@Injectable()
export class StoreService {

    constructor(private http: HttpClient) {
    }

    getAll(): Observable<Store[]> {
        return this.http.get<Store[]>('/api/store');
    }

    getById(id: number): Observable<Store> {
        return this.http.get<Store>('/api/store/' + id);
    }

    create(model: Store): Observable<Store> {
        return this.http.post<Store>('/api/store', model);
    }

    update(id: number, model: Store): Observable<Store> {
        return this.http.put<Store>('/api/store/' + id, model);
    }

    delete(id: number): Observable<any> {
        return this.http.delete<any>('/api/store/' + id);
    }
}

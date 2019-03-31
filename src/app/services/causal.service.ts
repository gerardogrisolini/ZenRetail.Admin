import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { Causal } from '../shared/models';
import { Helpers } from '../shared/helpers';

@Injectable()
export class CausalService {

    constructor(private http: HttpClient) {
    }

    getAll(): Observable<Causal[]> {
        return this.http.get<Causal[]>('/api/causal');
    }

    getById(id: number): Observable<Causal> {
        return this.http.get<Causal>('/api/causal/' + id);
    }

    create(model: Causal): Observable<Causal> {
        return this.http.post<Causal>('/api/causal', model);
    }

    update(id: number, model: Causal): Observable<Causal> {
        return this.http.put<Causal>('/api/causal/' + id, model);
    }

    delete(id: number): Observable<any> {
        return this.http.delete<any>('/api/causal/' + id);
    }
}

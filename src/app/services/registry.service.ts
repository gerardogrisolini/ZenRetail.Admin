import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { Registry } from '../shared/models';
import { Helpers } from '../shared/helpers';

@Injectable()
export class RegistryService {

    constructor(private http: HttpClient) {
    }

    getAll(): Observable<Registry[]> {
        return this.http.get<Registry[]>('/api/registry');
    }

    getById(id: number): Observable<Registry> {
        return this.http.get<Registry>('/api/registry/' + id);
    }

    create(model: Registry): Observable<Registry> {
        return this.http.post<Registry>('/api/registry', model);
    }

    update(id: number, model: Registry): Observable<Registry> {
        return this.http.put<Registry>('/api/registry/' + id, model);
    }

    delete(id: number): Observable<any> {
        return this.http.delete<any>('/api/registry/' + id);
    }
}

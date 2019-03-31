import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { Brand } from '../shared/models';
import { Helpers } from '../shared/helpers';

@Injectable()
export class BrandService {

    constructor(private http: HttpClient) {
    }

    getAll(): Observable<Brand[]> {
        return this.http.get<Brand[]>('/api/brand');
    }

    getById(id: number): Observable<Brand> {
        return this.http.get<Brand>('/api/brand/' + id);
    }

    create(model: Brand): Observable<Brand> {
        return this.http.post<Brand>('/api/brand', model);
    }

    update(id: number, model: Brand): Observable<Brand> {
        return this.http.put<Brand>('/api/brand/' + id, model);
    }

    delete(id: number): Observable<any> {
        return this.http.delete<any>('/api/brand/' + id);
    }
}

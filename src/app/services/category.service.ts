import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { Category } from '../shared/models';
import { Helpers } from '../shared/helpers';

@Injectable()
export class CategoryService {

    constructor(private http: HttpClient) {
    }

    getAll(): Observable<Category[]> {
        return this.http.get<Category[]>('/api/category');
    }

    getById(id: number): Observable<Category> {
        return this.http.get<Category>('/api/category/' + id);
    }

    create(model: Category): Observable<Category> {
        return this.http.post<Category>('/api/category', model);
    }

    update(id: number, model: Category): Observable<Category> {
        return this.http.put<Category>('/api/category/' + id, model);
    }

    delete(id: number): Observable<any> {
        return this.http.delete<any>('/api/category/' + id);
    }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { TagGroup, TagValue } from '../shared/models';
import { Helpers } from '../shared/helpers';

@Injectable()
export class TagService {

    constructor(private http: HttpClient) { }

    get(): Observable<TagGroup[]> {
        return this.http.get<TagGroup[]>('/api/tag');
    }

    getAll(): Observable<TagGroup[]> {
        return this.http.get<TagGroup[]>('/api/tag/all');
    }

    getById(id: number): Observable<TagGroup> {
        return this.http.get<TagGroup>('/api/tag/' + id);
    }

    create(model: TagGroup): Observable<TagGroup> {
        return this.http.post<TagGroup>('/api/tag', model);
    }

    update(id: number, model: TagGroup): Observable<TagGroup> {
        return this.http.put<TagGroup>('/api/tag/' + id, model);
    }

    delete(id: number): Observable<any> {
        return this.http.delete<any>('/api/tag/' + id);
    }

    getValueAll(): Observable<TagValue[]> {
        return this.http.get<TagValue[]>('/api/tagvalue');
    }

    getValueByTagId(id: number): Observable<TagValue[]> {
        return this.http.get<TagValue[]>('/api/tag/' + id + '/value');
    }

    getValueById(id: number): Observable<TagValue> {
        return this.http.get<TagValue>('/api/tagvalue/' + id);
    }

    createValue(model: TagValue): Observable<TagValue> {
        return this.http.post<TagValue>('/api/tagvalue', model);
    }

    updateValue(id: number, model: TagValue): Observable<TagValue> {
        return this.http.put<TagValue>('/api/tagvalue/' + id, model);
    }

    deleteValue(id: number): Observable<any> {
        return this.http.delete<any>('/api/tagvalue/' + id);
    }
}

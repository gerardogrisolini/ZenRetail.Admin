import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { Attribute, AttributeValue } from '../shared/models';
import { Helpers } from '../shared/helpers';

@Injectable()
export class AttributeService {

    public selected: Attribute;
    public values: AttributeValue[];

    constructor(private http: HttpClient) { }

    getAll(): Observable<Attribute[]> {
        return this.http.get<Attribute[]>('/api/attribute');
    }

    getById(id: number): Observable<Attribute> {
        return this.http.get<Attribute>('/api/attribute/' + id);
    }

    create(model: Attribute): Observable<Attribute> {
        return this.http.post<Attribute>('/api/attribute', model);
    }

    update(id: number, model: Attribute): Observable<Attribute> {
        return this.http.put<Attribute>('/api/attribute/' + id, model);
    }

    delete(id: number): Observable<any> {
        return this.http.delete<any>('/api/attribute/' + id);
    }

    getValueAll(): Observable<AttributeValue[]> {
        return this.http.get<AttributeValue[]>('/api/attributevalue');
    }

    getValueByAttributeId(id: number): Observable<AttributeValue[]> {
        return this.http.get<AttributeValue[]>('/api/attribute/' + id + '/value');
    }

    getValueById(id: number): Observable<AttributeValue> {
        return this.http.get<AttributeValue>('/api/attributevalue/' + id);
    }

    createValue(model: AttributeValue): Observable<AttributeValue> {
        return this.http.post<AttributeValue>('/api/attributevalue', model);
    }

    updateValue(id: number, model: AttributeValue): Observable<AttributeValue> {
        return this.http.put<AttributeValue>('/api/attributevalue/' + id, model);
    }

    deleteValue(id: number): Observable<any> {
        return this.http.delete<any>('/api/attributevalue/' + id);
    }
}

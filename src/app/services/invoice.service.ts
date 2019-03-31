import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { Invoice, Movement, MovementArticle, ItemValue } from '../shared/models';
import { Helpers } from '../shared/helpers';

@Injectable()
export class InvoiceService {

    constructor(private http: HttpClient) {
    }

    getPayments(): Observable<ItemValue[]> {
        return this.http.get<ItemValue[]>('/api/invoicepayment');
    }

    getAll(): Observable<Invoice[]> {
        return this.http.get<Invoice[]>('/api/invoice');
    }

    getById(id: number): Observable<Invoice> {
        return this.http.get<Invoice>('/api/invoice/' + id);
    }

    create(model: Invoice): Observable<Invoice> {
        return this.http.post<Invoice>('/api/invoice', model);
    }

    update(id: number, model: Invoice): Observable<Invoice> {
        return this.http.put<Invoice>('/api/invoice/' + id, model);
    }

    delete(id: number): Observable<any> {
        return this.http.delete<any>('/api/invoice/' + id);
    }

    getMovementsById(id: number): Observable<Movement[]> {
        return this.http.get<any>('/api/invoicemovement/' + id);
    }

    getMovementArticlesById(id: number): Observable<MovementArticle[]> {
        return this.http.get<MovementArticle[]>('/api/invoicemovementarticle/' + id);
    }

    addMovement(id: number, movementId: number): Observable<any> {
        const json = <ItemValue>{ value: movementId.toString() };
        return this.http.post<any>('/api/invoicemovement/' + id, json);
    }

    removeMovement(id: number): Observable<any> {
        return this.http.delete<any>('/api/invoicemovement/' + id);
    }
}

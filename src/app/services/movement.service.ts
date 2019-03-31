import { Injectable } from '@angular/core';
import { Http, ResponseContentType } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { HttpClient } from '@angular/common/http';
import { Movement, MovementArticle, Item, ItemValue, Cost, Period, Whouse } from '../shared/models';
import { Helpers } from '../shared/helpers';

@Injectable()
export class MovementService {

    movements: Movement[];

    constructor(private http: HttpClient) {
    }

    getAll(): Observable<Movement[]> {
        return this.http.get<Movement[]>('/api/movement');
    }

    getWhouse(date: Date, storeId: number): Observable<Whouse[]> {
        return this.http.get<Whouse[]>('/api/movementwhouse/' + date.toISOString() + '/' + storeId);
    }

    getSales(period: Period): Observable<MovementArticle[]> {
        return this.http.post<MovementArticle[]>('/api/movementsales', period);
    }

    getReceipted(period: Period): Observable<Movement[]> {
        return this.http.post<Movement[]>('/api/movementreceipted', period);
    }

    findById(id: number): Movement {
        return this.movements.find(p => p.movementId === id);
    }

    getById(id: number): Observable<Movement> {
        return this.http.get<Movement>('/api/movement/' + id);
    }

    getByRegistryId(id: number): Observable<Movement[]> {
        return this.http.get<Movement[]>('/api/movementregistry/' + id);
    }

    create(model: Movement): Observable<Movement> {
        return this.http.post<Movement>('/api/movement', model);
    }

    clone(id: number): Observable<Movement> {
        return this.http.post<Movement>('/api/movement/' + id, null);
    }

    update(id: number, model: Movement): Observable<Movement> {
        return this.http.put<Movement>('/api/movement/' + id, model);
    }

    delete(id: number): Observable<any> {
        return this.http.delete<any>('/api/movement/' + id);
    }

    getItemsById(movementId: number): Observable<MovementArticle[]> {
        return this.http.get<MovementArticle[]>('/api/movementarticle/' + movementId);
    }

    createItem(model: MovementArticle, price: string): Observable<MovementArticle> {
        return this.http.post<MovementArticle>('/api/movementarticle/' + price, model);
    }

    updateItem(id: number, model: MovementArticle): Observable<MovementArticle> {
        return this.http.put<MovementArticle>('/api/movementarticle/' + id, model);
    }

    deleteItem(id: number): Observable<any> {
        return this.http.delete<any>('/api/movementarticle/' + id);
    }

    getStatus(): Observable<ItemValue[]> {
        return this.http.get<ItemValue[]>('/api/movementstatus');
    }

    getPayments(): Observable<Item[]> {
        return this.http.get<Item[]>('/api/movementpayment');
    }

    getShippings(): Observable<Item[]> {
        return this.http.get<Item[]>('/api/movementshipping');
    }

    getShippingCost(id: number, shipping: string): Observable<Cost> {
        return this.http.get<Cost>('/api/movement/' + id + '/cost/' + shipping);
    }

    getBarcode(movementId: number): Observable<Blob> {
        return this.http.get<Blob>('/api/pdf/barcode/' + movementId);
    }
}

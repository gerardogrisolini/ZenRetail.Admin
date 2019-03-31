import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { Account } from '../shared/models';
import { Helpers } from '../shared/helpers';

@Injectable()
export class AccountService {

    constructor(private http: HttpClient) {
    }

    getAll(): Observable<Account[]> {
        return this.http.get<Account[]>('/api/account');
    }

    getById(id: string): Observable<Account> {
        return this.http.get<Account>('/api/account/' + id);
    }

    create(model: Account): Observable<Account> {
        return this.http.post<Account>('/api/account', model);
    }

    update(id: string, model: Account): Observable<Account> {
        return this.http.put<Account>('/api/account/' + id, model);
    }

    delete(id: string): Observable<any> {
        return this.http.delete<any>('/api/account/' + id);
    }
}

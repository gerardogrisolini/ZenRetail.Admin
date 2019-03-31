import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { Device } from '../shared/models';
import { Helpers } from '../shared/helpers';

@Injectable()
export class DeviceService {

    constructor(private http: HttpClient) {
    }

    getAll(): Observable<Device[]> {
        return this.http.get<Device[]>('/api/device');
    }

    getById(id: number): Observable<Device> {
        return this.http.get<Device>('/api/device/' + id);
    }

    create(model: Device): Observable<Device> {
        return this.http.post<Device>('/api/device', model);
    }

    update(id: number, model: Device): Observable<Device> {
        return this.http.put<Device>('/api/device/' + id, model);
    }

    delete(id: number): Observable<any> {
        return this.http.delete<any>('/api/device/' + id);
    }
}

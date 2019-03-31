import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { Publication } from '../shared/models'
import { Helpers } from '../shared/helpers'

@Injectable()
export class PublicationService {

    public publication: Publication;

    constructor(private http: HttpClient) {
        this.publication = new Publication(0);
    }

    get(id: number): Observable<Publication> {
        return this.http.get<Publication>('/api/publication/' + id);
    }

    getByProductId(productId: number): Observable<Publication> {
        return this.http.get<Publication>('/api/product/' + productId + '/publication');
    }

    create(productId: number): Observable<Publication> {
        this.publication.productId = productId;
        return this.http.post<Publication>('/api/publication', this.publication);
    }

    update(): Observable<Publication> {
        return this.http.put<Publication>(
            '/api/publication/' + this.publication.publicationId,
            this.publication
        );
    }
}

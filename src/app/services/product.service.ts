import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import {
    Product, ProductCategory, ProductAttribute,
    ProductAttributeValue, Article, ArticleForm,
    Tax, ItemValue, GroupItem, Result
} from '../shared/models';

@Injectable()
export class ProductService {

    public product: Product;
    public products: Product[];

    constructor(private http: HttpClient) {
    }

    getTaxes(): Observable<Tax[]> {
        return this.http.get<Tax[]>('/api/producttax');
    }

    getTypes(): Observable<ItemValue[]> {
        return this.http.get<ItemValue[]>('/api/producttype');
    }

    getProducts(): Observable<Product[]> {
        return this.http.get<Product[]>('/api/product');
    }

    getProduct(id: number): Observable<Product> {
        return this.http.get<Product>('/api/product/' + id);
    }

    getBarcode(id: string): Observable<Product> {
        return this.http.get<Product>('/api/product/barcode/' + id);
    }

    getArticles(id: number): Observable<Article[]> {
        return this.http.get<Article[]>('/api/product/' + id + '/article');
    }

    getStock(id: number, storeIds: string, tagId: number): Observable<ArticleForm> {
        return this.http.get<ArticleForm>(
            '/api/product/' + id + '/store/' + storeIds + '/' + tagId
        );
    }

    getGroup(id: number): Observable<[GroupItem]> {
        return this.http.get<[GroupItem]>('/api/product/' + id + '/group');
    }

    addArticle(model: Article): Observable<GroupItem> {
        return this.http.post<GroupItem>('/api/article', model);
    }

    updateArticle(id: number, model: Article): Observable<Article> {
        return this.http.put<Article>('/api/article/' + id, model);
    }

    removeArticle(id: number): Observable<any> {
        return this.http.delete<any>('/api/article/' + id);
    }

    create(model: Product): Observable<Product> {
        return this.http.post<Product>('/api/product', model);
    }

    update(id: number, model: Product): Observable<Product> {
        return this.http.put<Product>('/api/product/' + id, model);
    }

    resetAmazon(id: number): Observable<any> {
        return this.http.get<any>('/api/product/' + id + '/reset');
    }

    delete(id: number): Observable<any> {
        return this.http.delete<any>('/api/product/' + id);
    }

    addCategories(models: ProductCategory[]): Observable<ProductCategory[]> {
        return this.http.post<ProductCategory[]>('/api/productcategory', models);
    }

    removeCategories(models: ProductCategory[]): Observable<any> {
        return this.http.put<any>('/api/productcategory', models);
    }

    addAttributes(models: ProductAttribute[]): Observable<ProductAttribute[]> {
        return this.http.post<ProductAttribute[]>('/api/productattribute', models);
    }

    removeAttributes(models: ProductAttribute[]): Observable<any> {
        return this.http.put<any>('/api/productattribute', models);
    }

    addAttributeValues(models: ProductAttributeValue[]): Observable<ProductAttributeValue[]> {
        return this.http.post<ProductAttributeValue[]>('/api/productattributevalue', models);
    }

    removeAttributeValues(models: ProductAttributeValue[]): Observable<any> {
        return this.http.put<any>('/api/productattributevalue', models);
    }

    build(id: number): Observable<Result> {
        return this.http.get<Result>('/api/product/' + id + '/build');
    }
}

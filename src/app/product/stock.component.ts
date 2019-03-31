import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { SelectItem } from 'primeng/primeng';
import { MessageService } from 'primeng/components/common/messageservice';
import {
    Product, ProductCategory, Category, ProductAttribute, Attribute,
    ProductAttributeValue, Article, ArticleAttributeValue, AttributeValue, ArticleForm
} from './../shared/models';
import { Helpers } from './../shared/helpers';
import { SessionService } from './../services/session.service';
import { ProductService } from './../services/product.service';
import { StoreService } from './../services/store.service';

@Component({
    selector: 'app-stock',
    templateUrl: 'stock.component.html'
})

export class StockComponent implements OnInit, OnDestroy {
    private sub: any;
    stores: SelectItem[];
    product: Product;
    articleForm: ArticleForm;
    totalRecords = 0;
    totalStocks = 0;
    totalBookeds = 0;
    isBusy: boolean;

    constructor(private activatedRoute: ActivatedRoute,
                private messageService: MessageService,
                private sessionService: SessionService,
                private productService: ProductService,
                private storeService: StoreService,
                private location: Location) {
    }

    ngOnInit() {
        this.sessionService.checkCredentials(false);
        this.sessionService.setTitle('Stock');

        this.isBusy = true;

        // Subscribe to route params
        this.sub = this.activatedRoute.params.subscribe(params => {
            const productId = Number(params['id']);
            this.product = this.productService.products.find(p => p.productId === productId);
            this.totalRecords = this.product.articles.length;
            this.createSheet('0');
        });

        this.storeService.getAll()
            .subscribe(result => {
                this.stores = result.map(p => Helpers.newSelectItem(p.storeId, p.storeName));
            }, onerror => this.messageService.add({severity: 'error', summary: '', detail: onerror._body})
        );
    }

    ngOnDestroy() {
        // Clean sub to avoid memory leak
        this.sub.unsubscribe();
    }

    cancelClick() {
        this.location.back();
    }

    createSheet(storeIds: string) {
        this.isBusy = true;
        // if (storeIds === '') {
        //     storeIds = '0';
        // }
        this.totalStocks = 0;
        this.totalBookeds = 0;
        this.productService.getStock(this.product.productId, storeIds, 0)
            .subscribe(result => {
                this.articleForm = result;
                this.articleForm.body.forEach(a => {
                    a.forEach(b => {
                        this.totalStocks += b.stock;
                        this.totalBookeds += b.booked;
                    });
                });
                this.isBusy = false;
            }, onerror => this.messageService.add({severity: 'error', summary: '', detail: onerror._body}));
    }

    onStoreChanged(event: any) {
        this.createSheet(event.value.join(','));
    }
}

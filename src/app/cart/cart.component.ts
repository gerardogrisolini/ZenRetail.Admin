import { Component, OnInit, Input } from '@angular/core';
import { MessageService } from 'primeng/api';
import { SessionService } from './../services/session.service';
import { Basket } from './../shared/models';
import { CompanyService } from '../services/company.service';

@Component({
    selector: 'app-cart-component',
    templateUrl: 'cart.component.html'
})

export class CartComponent implements OnInit {
    totalRecords = 0;
    items: Basket[];
    cols: any[];

    constructor(private messageService: MessageService,
                private sessionService: SessionService,
                private companyService: CompanyService) {
        this.cols = [
            { field: 'basketId', header: 'Id' },
            { field: 'registry.registryName', header: 'Customer' },
            { field: 'basketBarcode', header: 'Barcode' },
            { field: 'basketProduct', header: 'Product' },
            { field: 'basketQuantity', header: 'Quantity' },
            { field: 'basketPrice', header: 'Price' },
            { field: 'basketUpdated', header: 'UpdatedAt' }
        ];   
    }

    ngOnInit() {
        this.sessionService.checkCredentials(false);
        this.sessionService.setTitle('Carts');
        this.refreshClick();
    }

    refreshClick() {
        this.companyService
            .getBaskets()
            .subscribe(result => {
                this.items = result;
                this.totalRecords = this.items.length;
            }, onerror => this.messageService.add({severity: 'error', summary: '', detail: onerror._body})
        );
    }
}

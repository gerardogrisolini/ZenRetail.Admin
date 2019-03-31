import { Component, OnInit, Input } from '@angular/core';
import { ConfirmationService } from 'primeng/primeng';
import { MessageService } from 'primeng/components/common/messageservice';
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

    constructor(private messageService: MessageService,
                private sessionService: SessionService,
                private companyService: CompanyService,
                private confirmationService: ConfirmationService) {
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

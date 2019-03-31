import { Component, OnInit } from '@angular/core';
import { Message } from 'primeng/primeng';
import { MessageService } from 'primeng/components/common/messageservice';
import { ConfirmationService } from 'primeng/primeng';
import {
    Product, Article, Barcode, GroupItem, Packaging
} from './../shared/models';
import { Helpers } from './../shared/helpers';
import { SessionService } from './../services/session.service';
import { ProductService } from './../services/product.service';
import { ProductComponent } from './product.component';
import { ArticlePickerComponent } from '../shared/article-picker.component';
import { EventEmitter } from 'events';

@Component({
    selector: 'app-grouped',
    templateUrl: 'grouped.component.html'
})

export class GroupedComponent implements OnInit {
    articleForm: [GroupItem];
    totalRecords = 0;

    constructor(private messageService: MessageService,
                private confirmationService: ConfirmationService,
                private sessionService: SessionService,
                private productService: ProductService) {
    }

    get product(): Product { return this.productService.product; }

    ngOnInit() {
        this.sessionService.checkCredentials(false);

        this.productService.getGroup(this.product.productId)
            .subscribe(result => {
                this.articleForm = result;
                this.totalRecords = this.articleForm.length;
            }, onerror => this.messageService.add({severity: 'error', summary: 'Error', detail: onerror._body}));
    }

    addClick() {
        const comp = ProductComponent.instance.openSidebarClick('Articles');
        comp.instance.onPicked.subscribe((data) => this.pickerClick(data));
    }

    pickerClick(data) {
        ProductComponent.instance.closeSidebarClick(null);
        data.forEach(element => {
            const array = element.split('#');
            const barcode = array[0];
            this.productService
                .getBarcode(barcode)
                .subscribe(result => {
                    const group = <GroupItem>{ id: 0, barcode: barcode, product: result };
                    this.articleForm.push(group);
                    this.product.articles.push(result.articles[0]);
                    this.totalRecords++;
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Articles',
                        detail: 'Added successfully!'
                    });
                });
        });
    }

    removeClick(barcode) {
        this.confirmationService.confirm({
            message: 'Are you sure that you want to remove this article?',
            accept: () => {
                let index = this.articleForm.findIndex(p => p.barcode === barcode);
                this.articleForm.splice(index, 1);
                index = this.product.articles.findIndex(p => p.barcodes.map(b => b.barcode) === barcode);
                this.product.articles.splice(index, 1);
                this.totalRecords--;
            }
        });
    }
}

import { Component, OnInit, OnDestroy, Input, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, SelectItem } from 'primeng/primeng';
import { MessageService } from 'primeng/components/common/messageservice';
import { SessionService } from './../services/session.service';
import { MovementService } from './../services/movement.service';
import { Movement, MovementArticle } from './../shared/models';
import { Helpers } from './../shared/helpers';
import { ArticlePickerComponent } from './../shared/article-picker.component';
import { ScannerComponent } from './scanner.component';

@Component({
    selector: 'app-movement-component',
    templateUrl: 'movement.component.html'
})

export class MovementComponent implements OnInit, OnDestroy {
    @ViewChild('dynamicComponentContainer', { read: ViewContainerRef }) divContainer;
    private sub: any;
    movementId: number;
    totalRecords = 0;
    totalItems = 0;
    totalAmount = 0.0;
    barcodes: string[];
    item: Movement;
    items: MovementArticle[];
    articleValue: string;
    priceValue: number;
    amountValue: number;
    committed: boolean;
    isScannig: boolean;

    constructor(
        private activatedRoute: ActivatedRoute,
        private translate: TranslateService,
        public sessionService: SessionService,
        private messageService: MessageService,
        private movementService: MovementService,
        private componentFactoryResolver: ComponentFactoryResolver,
        private confirmationService: ConfirmationService,
        private location: Location) {
        this.barcodes = [];
    }

    ngOnInit() {
        this.sessionService.checkCredentials(false);
        this.sessionService.setTitle('Movement');

        // Subscribe to route params
        this.sub = this.activatedRoute.params.subscribe(params => {
            if (!this.movementService.movements) {
                this.cancelClick();
                return;
            }
            this.movementId = Number(params['id']);
            this.item = this.movementService.movements.find(p => p.movementId === this.movementId);
            this.committed = this.item.movementStatus !== 'New';

            this.movementService.getItemsById(this.movementId)
                .subscribe(result => {
                    this.items = result;
                    this.updateTotals();
                }, onerror => this.messageService.add({severity: 'error', summary: '', detail: onerror._body})
            );
        });
    }

    ngOnDestroy() {
        // Clean sub to avoid memory leak
        this.sub.unsubscribe();
    }

    cancelClick() {
        this.location.back();
    }

    reloadData() {
        // let newItems = new Array<MovementArticle>(this.items.length);
        // for (var i = 0; i < newItems.length; i++) {
        //     newItems[i] = this.items[i];
        // }
        this.items =  this.items.map(p => p);
        this.updateTotals();
    }

   updateTotals() {
        if (!this.items || this.items.length === 0) {
            this.totalRecords = 0;
            this.totalItems = 0;
            this.totalAmount = 0;
            return;
        }
        this.totalRecords = this.items.length;
        this.totalItems = this.items.map(p => p.movementArticleQuantity).reduce((sum, current) => sum + current);
        this.totalAmount = this.items.map(p => p.movementArticleAmount).reduce((sum, current) => sum + current);
        this.item.movementAmount = this.totalAmount;
    }

    addBarcode() {
        this.barcodes.forEach(data => {
            const array = data.split('#');
            const barcode = array[0];
            const quantity = array.length === 2 ? Number(array[1]) : 1.0;
            let newItem = this.items.find(p => p.movementArticleBarcode === barcode && p.movementArticleQuantity >= 0);
            if (newItem) {
                newItem.movementArticleQuantity += quantity;
                this.movementService
                    .updateItem(newItem.movementArticleId, newItem)
                    .subscribe(result => {
                        this.barcodes.splice(this.barcodes.indexOf(data), 1);
                        this.updateTotals();
                    }, onerror => this.messageService.add({severity: 'error', summary: '', detail: onerror._body}));
            } else {
                newItem = new MovementArticle();
                newItem.movementId = this.movementId;
                newItem.movementArticleBarcode = barcode;
                newItem.movementArticleQuantity = quantity;
                const price = this.item.movementCausal.causalQuantity > 0
                    ? 'purchase'
                    : this.item.movementCausal.causalQuantity < 0 ? 'selling' : 'none';
                this.movementService
                    .createItem(newItem, price)
                    .subscribe(result => {
                        this.items.push(result);
                        this.barcodes.splice(this.barcodes.indexOf(data), 1);
                        this.reloadData();
                    },
                    onerror => {
                        this.translate.get('Barcode not found!').subscribe((res: string) => {
                            this.messageService.add({
                                severity: 'error', summary: '',
                                detail: onerror.status === 404 ? res : onerror._body
                            });
                        });
                    }
                );
            }
        });
    }

    barcodePickerClick() {
        this.isScannig = !this.isScannig;
    }

    scannerRead(code: string) {
        this.barcodes = this.barcodes.concat(code);
        this.addBarcode();
    }

    articlePickerClick() {
        this.translate.get('Articles picker').subscribe((res: string) => {
            this.sessionService.titleSidebar = res;
            const factory = this.componentFactoryResolver.resolveComponentFactory(ArticlePickerComponent);
            const comp = this.divContainer.createComponent(factory);
            comp.instance.onPicked.subscribe((data) => this.pickerClick(data));
        });
    }

    closeSidebarClick(event) {
        this.sessionService.titleSidebar = '';
        this.divContainer.clear();
    }

    pickerClick(event: any) {
        this.sessionService.titleSidebar = '';
        this.barcodes = this.barcodes.concat(event);
        this.addBarcode();
    }

    onUpdate(data: MovementArticle) {
        if (data.movementArticleQuantity === 0) {
            data.movementArticleAmount = 0;
            this.translate.get('Are you sure that you want to delete this product?')
                .subscribe((res: string) => {
                    this.confirmationService.confirm({
                        message: res,
                        accept: () => {
                            this.movementService
                                .deleteItem(data.movementArticleId)
                                .subscribe(result => {
                                    this.items.splice(this.items.indexOf(data), 1);
                                    this.reloadData();
                                }, onerror => this.messageService.add({severity: 'error', summary: '', detail: onerror._body}));
                        }
                    });
            });
        } else {
            this.movementService
                .updateItem(data.movementArticleId, data)
                .subscribe(result => {
                    data.movementArticleAmount = result.movementArticleAmount;
                    this.updateTotals();
                }, onerror => this.messageService.add({severity: 'error', summary: '', detail: onerror._body}));
        }
    }

    completedClick() {
        this.translate.get('Are you sure that you want to complete this movement?')
            .subscribe((res: string) => {
                this.confirmationService.confirm({
                    message: res,
                    accept: () => {
                        this.item.movementStatus = 'Completed';
                        this.movementService.update(this.item.movementId, this.item)
                            .subscribe(result => {
                                this.cancelClick();
                            }, onerror => this.messageService.add({severity: 'error', summary: '', detail: onerror._body})
                        );
                    }
                });
            });
    }
}

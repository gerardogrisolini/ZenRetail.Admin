import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ConfirmationService, SelectItem } from 'primeng/primeng';
import { MessageService } from 'primeng/components/common/messageservice';
import { SessionService } from './../services/session.service';
import { InvoiceService } from './../services/invoice.service';
import { Invoice, Movement } from './../shared/models';
import { Helpers } from './../shared/helpers';
import { MovementPickerComponent } from './../shared/movement-picker.component';

@Component({
    selector: 'app-invoice-component',
    templateUrl: 'invoice.component.html'
})

export class InvoiceComponent implements OnInit, OnDestroy {
    @ViewChild(MovementPickerComponent) inputComponent: MovementPickerComponent;
    public helpers = Helpers;
    private sub: any;
    invoiceId: number;
    totalRecords = 0;
    totalAmount = 0.0;
    codes: string[];
    item: Invoice;
    items: Movement[];
    itemsSelected: Movement[];
    stores: SelectItem[];
    storesFiltered: SelectItem[];
    causals: SelectItem[];
    causalsFiltered: SelectItem[];
    dateStartValue: Date;
    dateFinishValue: Date;
    amountValue: number;

    constructor(
        private messageService: MessageService,
        private translate: TranslateService,
        private activatedRoute: ActivatedRoute,
        private sessionService: SessionService,
        private invoiceService: InvoiceService,
        private confirmationService: ConfirmationService,
        private location: Location) {
        this.codes = [];
        this.itemsSelected = [];
    }

    ngOnInit() {
        this.sessionService.checkCredentials(false);
        this.sessionService.setTitle('Invoice');

        // Subscribe to route params
        this.sub = this.activatedRoute.params.subscribe(params => {
            this.invoiceId = params['id'];
            this.invoiceService.getById(this.invoiceId)
                .subscribe(result => {
                    this.item = result;
                }, onerror => this.messageService.add({severity: 'error', summary: '', detail: onerror._body})
            );
            this.invoiceService.getMovementsById(this.invoiceId)
                .subscribe(result => {
                    this.items = result;
                    this.updateTotals();
                    this.buildFilter(this.items);
                }, onerror => this.messageService.add({severity: 'error', summary: '', detail: onerror._body}));
        });
    }

    ngOnDestroy() {
        // Clean sub to avoid memory leak
        this.sub.unsubscribe();
    }

    cancelClick() {
        this.location.back();
    }

    buildFilter(items: Movement[]) {
        this.translate.get('All').subscribe((res: string) => {
            this.storesFiltered = [];
            this.storesFiltered.push({label: res, value: null});
            const filterStores = Helpers.distinct(items.map((item: Movement) => Helpers.newSelectItem(item.movementStore.storeName)));
            this.storesFiltered = this.storesFiltered.concat(filterStores);

            this.causalsFiltered = [];
            this.causalsFiltered.push({label: res, value: null});
            const filterCusals = Helpers.distinct(items.map((item: Movement) => Helpers.newSelectItem(item.movementCausal.causalName)));
            this.causalsFiltered = this.causalsFiltered.concat(filterCusals);
        });
    }

    showPickerClick() {
        this.inputComponent.loadData(this.item.invoiceRegistry.registryId);
    }

    pickerClick(event: any) {
        event.forEach(id => {
            this.invoiceService
                .addMovement(this.invoiceId, Number(id))
                .subscribe(result => {
                    this.invoiceService.getMovementsById(this.invoiceId)
                                       .subscribe(res => {
                                            this.items = res;
                                            this.updateTotals();
                                       });
                }, onerror => this.messageService.add({severity: 'error', summary: '', detail: onerror._body}));
        });
    }

    removeClick() {
        this.translate.get('Are you sure that you want to remove this selected movements?').subscribe((res: string) =>
            this.confirmationService.confirm({
                message: res,
                accept: () => {
                    this.itemsSelected.forEach(p => {
                        this.invoiceService
                            .removeMovement(p.movementId)
                            .subscribe(result => {
                                this.items.splice(this.items.indexOf(p), 1);
                                this.reloadData();
                            }, onerror => this.messageService.add({severity: 'error', summary: '', detail: onerror._body}));
                    });
                }
            })
        );
    }

    reloadData() {
        this.items =  this.items.map(p => p);
        this.updateTotals();
    }

    updateTotals() {
        if (!this.items || this.items.length === 0) {
            return;
        }
        this.totalRecords = this.items.length;
        this.totalAmount = this.items.map(p => p.movementAmount).reduce((sum, current) => sum + current);
    }
}

import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { ConfirmationService, SelectItem, MenuItem } from 'primeng/primeng';
import { MessageService } from 'primeng/components/common/messageservice';
import { SessionService } from './../services/session.service';
import { InvoiceService } from './../services/invoice.service';
import { RegistryService } from './../services/registry.service';
import { Invoice } from './../shared/models';
import { Helpers } from './../shared/helpers';

@Component({
    selector: 'app-invoices-component',
    templateUrl: 'invoices.component.html'
})

export class InvoicesComponent implements OnInit {
    public helpers = Helpers;
    totalRecords = 0;
    items: Invoice[];
    selected: Invoice;
    registries: SelectItem[];
    registriesFiltered: SelectItem[];
    payments: SelectItem[];
    buttons: MenuItem[];
    displayPanel: boolean;
    dataform: FormGroup;
    dateStartValue: Date;
    dateFinishValue: Date;
    amountValue: number;

    constructor(
        private router: Router,
        private messageService: MessageService,
        private translate: TranslateService,
        private sessionService: SessionService,
        private invoiceService: InvoiceService,
        private registryService: RegistryService,
        private confirmationService: ConfirmationService,
        private fb: FormBuilder) {
    }

    ngOnInit() {
        this.sessionService.checkCredentials(false);
        this.sessionService.setTitle('Invoices');

        this.dataform = this.fb.group({
            'number': new FormControl('', Validators.required),
            'date': new FormControl('', Validators.required),
            'registry': new FormControl('', Validators.required),
            'payment': new FormControl('', Validators.required),
            'note': new FormControl('', Validators.nullValidator)
        });

        this.invoiceService
            .getAll()
            .subscribe(result => {
                this.items = result;
                this.totalRecords = this.items.length;
                this.registriesFiltered = [];
                this.translate.get('All').subscribe((res: string) =>
                    this.registriesFiltered.push({label: res, value: null}));
                const filterRegistry = Helpers.distinct(result.map((item: Invoice) =>
                    Helpers.newSelectItem(item.invoiceRegistry.registryName)));
                this.registriesFiltered = this.registriesFiltered.concat(filterRegistry);
             }
        );

        this.registryService
            .getAll()
            .subscribe(result => {
                this.registries = [];
                this.registries.push({label: '', value: null});
                this.registries = this.registries.concat(result.map(p => Helpers.newSelectItem(p, p.registryName)));
            }
        );

        this.invoiceService
            .getPayments()
            .subscribe(result => {
                this.payments = result.map(p => Helpers.newSelectItem(p.value));
            }
        );

        this.translate.get('Document').subscribe((res: string) => {
            this.buttons = [
                { label: res, icon: 'pi pi-print', command: (event) => this.openClick('document/') }
            ];
        });
    }

    get isNew(): boolean { return this.selected.invoiceId === 0; }

    get selectedIndex(): number { return this.items.indexOf(this.selected); }

    addClick() {
        this.selected = new Invoice();
        this.selected.invoicePayment = this.payments[0].value;
        this.displayPanel = true;
    }

    editClick() {
        if (!this.selected) {
            return;
        }
        this.displayPanel = true;
    }

    closeClick() {
        this.displayPanel = false;
        this.selected = null;
    }

    saveClick() {
        if (this.isNew) {
            this.invoiceService.create(this.selected)
                .subscribe(result => {
                    this.selected = result;
                    this.totalRecords++;
                    this.openClick();
                }, onerror => this.messageService.add({severity: 'error', summary: '', detail: onerror._body}));
        } else {
            this.invoiceService.update(this.selected.invoiceId, this.selected)
                .subscribe(result => {
                    this.items[this.selectedIndex] = result;
                    this.closeClick();
                }, onerror => {
                    this.messageService.add({severity: 'error', summary: '', detail: onerror._body});
                });
        }
    }

    deleteClick() {
        if (!this.selected) {
            return;
        }
        this.translate.get('Are you sure that you want to delete this invoice?')
            .subscribe((res: string) => this.confirmationService.confirm({
                message: res,
                accept: () => {
                    this.invoiceService.delete(this.selected.invoiceId)
                    .subscribe(result => {
                        this.items.splice(this.selectedIndex, 1);
                        this.totalRecords--;
                        this.closeClick();
                    }, onerror => this.messageService.add({severity: 'error', summary: '', detail: onerror._body}));
                }
            })
        );
    }

    openClick(detail = '') {
        if (!this.selected) {
            return;
        }
        this.router.navigateByUrl('invoice/' + detail + this.selected.invoiceId);
    }
}

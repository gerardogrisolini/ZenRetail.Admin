import { Component, OnInit, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { ConfirmationService } from 'primeng/primeng';
import { MessageService } from 'primeng/components/common/messageservice';
import { SessionService } from './../services/session.service';
import { StoreService } from './../services/store.service';
import { Store } from './../shared/models';
import { Helpers } from './../shared/helpers';

@Component({
    selector: 'app-store-component',
    templateUrl: 'store.component.html'
})

export class StoreComponent implements OnInit {
    totalRecords = 0;
    stores: Store[];
    selected: Store;
    displayPanel: boolean;
    dataform: FormGroup;

    constructor(
        private messageService: MessageService,
        private translate: TranslateService,
        private sessionService: SessionService,
        private storeService: StoreService,
        private confirmationService: ConfirmationService,
        private fb: FormBuilder) {
    }

    ngOnInit() {
        this.sessionService.checkCredentials(false);
        this.sessionService.setTitle('Stores');

        this.dataform = this.fb.group({
            'name': new FormControl('', Validators.required),
            'address': new FormControl('', Validators.nullValidator),
            'city': new FormControl('', Validators.nullValidator),
            'zip': new FormControl('', [Validators.nullValidator, Validators.minLength(5), Validators.maxLength(5)]),
            'country': new FormControl('', Validators.nullValidator)
        });

        this.storeService
            .getAll()
            .subscribe(result => {
                this.stores = result;
                this.totalRecords = this.stores.length;
            }, onerror => this.messageService.add({severity: 'error', summary: '', detail: onerror._body})
        );
    }

    get isNew(): boolean { return this.selected == null || this.selected.storeId === 0; }

    get selectedIndex(): number { return this.stores.indexOf(this.selected); }

    addClick() {
        this.selected = new Store();
        this.displayPanel = true;
    }

    onRowSelect(event: any) {
        this.displayPanel = true;
    }

    closeClick() {
        this.displayPanel = false;
        this.selected = null;
    }

    saveClick() {
        if (this.isNew) {
            this.storeService
                .create(this.selected)
                .subscribe(result => {
                    this.stores.push(result);
                    this.totalRecords++;
                    this.closeClick();
                }, onerror => this.messageService.add({severity: 'error', summary: '', detail: onerror._body}));
        } else {
            this.storeService
                .update(this.selected.storeId, this.selected)
                .subscribe(result => {
                    this.closeClick();
                }, onerror => this.messageService.add({severity: 'error', summary: '', detail: onerror._body}));
        }
    }

    deleteClick() {
        this.translate
            .get('All related stocks articles will be deleted. Are you sure that you want to delete this store?')
            .subscribe((res: string) =>
            this.confirmationService.confirm({
                message: res,
                accept: () => {
                    this.storeService
                        .delete(this.selected.storeId)
                        .subscribe(result => {
                            this.stores.splice(this.selectedIndex, 1);
                            this.totalRecords--;
                            this.closeClick();
                        }, onerror => this.messageService.add({severity: 'error', summary: '', detail: onerror._body}));
                }
            })
        );
    }
}

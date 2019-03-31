import { Component, OnInit, Input } from '@angular/core';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, SelectItem } from 'primeng/primeng';
import { MessageService } from 'primeng/components/common/messageservice';
import { SessionService } from './../services/session.service';
import { DeviceService } from './../services/device.service';
import { StoreService } from './../services/store.service';
import { Device, Store } from './../shared/models';
import { Helpers } from './../shared/helpers';

@Component({
    selector: 'app-device-component',
    templateUrl: 'device.component.html'
})

export class DeviceComponent implements OnInit {
    totalRecords = 0;
    items: Device[];
    selected: Device;
    stores: SelectItem[] = [];
    displayPanel: boolean;
    dataform: FormGroup;

    constructor(
        private messageService: MessageService,
        private translate: TranslateService,
        private sessionService: SessionService,
        private deviceService: DeviceService,
        private storeService: StoreService,
        private confirmationService: ConfirmationService,
        private fb: FormBuilder) {
    }

    ngOnInit() {
        this.sessionService.checkCredentials(false);
        this.sessionService.setTitle('Devices');

        this.dataform = this.fb.group({
            'name': new FormControl('', Validators.required),
            'token': new FormControl('', Validators.nullValidator),
            'store': new FormControl('', Validators.required),
            'join': new FormControl('', Validators.required)
        });

        this.deviceService
            .getAll()
            .subscribe(result => {
                this.items = result;
                this.totalRecords = this.items.length;
            }, onerror => this.messageService.add({severity: 'error', summary: '', detail: onerror._body})
        );

        this.storeService.getAll()
            .subscribe(result => {
                this.stores.push({label: '', value: null})
                this.stores = this.stores.concat(result.map(p => Helpers.newSelectItem(p, p.storeName)));
            }, onerror => this.messageService.add({severity: 'error', summary: '', detail: onerror._body})
        );
    }

    get isNew(): boolean { return this.selected == null || this.selected.deviceId === 0; }

    get selectedIndex(): number { return this.items.indexOf(this.selected); }

    addClick() {
        this.selected = new Device();
        this.selected.store = this.stores.length > 0 ? this.stores[0].value : null;
        this.dataform.controls.join.setValue(false);
        this.displayPanel = true;
    }

    onRowSelect(event: any) {
        this.dataform.controls.join.setValue(false);
        const json = localStorage.getItem('zenretailDevice');
        if (json != null) {
            const device: Device = JSON.parse(json)
            if (device.deviceId === this.selected.deviceId) {
                this.dataform.controls.join.setValue(true);
            }
        }
        if (this.selected.store.storeId === 0) {
            this.selected.store = null;
        }
        this.displayPanel = true;
    }

    closeClick() {
        if (this.dataform.controls.join.value === true) {
            localStorage.setItem('zenretailDevice', JSON.stringify(this.selected));
        } else {
            localStorage.removeItem('zenretailDevice');
        }
        this.displayPanel = false;
        this.selected = null;
    }

    saveClick() {
        if (this.isNew) {
            this.deviceService
                .create(this.selected)
                .subscribe(result => {
                    this.selected = result;
                    this.items.push(result);
                    this.totalRecords++;
                    this.closeClick();
                }, onerror => this.messageService.add({severity: 'error', summary: '', detail: onerror._body}));
        } else {
            this.deviceService
                .update(this.selected.deviceId, this.selected)
                .subscribe(result => {
                    this.closeClick();
                }, onerror => this.messageService.add({severity: 'error', summary: '', detail: onerror._body}));
        }
    }

    deleteClick() {
        this.translate.get('Are you sure that you want to delete this device?')
            .subscribe((res: string) => this.confirmationService.confirm({
                message: res,
                accept: () => {
                    this.deviceService
                    .delete(this.selected.deviceId)
                    .subscribe(result => {
                        this.items.splice(this.selectedIndex, 1);
                        this.totalRecords--;
                        this.closeClick();
                    }, onerror => this.messageService.add({severity: 'error', summary: 'Error', detail: onerror._body}));
                }
            })
        );
    }
}

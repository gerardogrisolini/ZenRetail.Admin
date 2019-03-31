import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { ConfirmationService, SelectItem, MenuItem } from 'primeng/primeng';
import { MessageService } from 'primeng/components/common/messageservice';
import { SessionService } from './../services/session.service';
import { StoreService } from './../services/store.service';
import { CausalService } from './../services/causal.service';
import { RegistryService } from './../services/registry.service';
import { MovementService } from './../services/movement.service';
import { TagService } from './../services/tag.service';
import { Movement, Device, TagGroup, Tag, TagValue } from './../shared/models';
import { Helpers } from './../shared/helpers';

@Component({
    selector: 'app-movements-component',
    templateUrl: 'movements.component.html'
})

export class MovementsComponent implements OnInit {
    public helpers = Helpers;
    totalRecords = 0;
    selected: Movement;
    device: Device;
    shippings: SelectItem[];
    cashregisters: SelectItem[];
    stores: SelectItem[];
    storesFiltered: SelectItem[];
    causals: SelectItem[];
    causalsFiltered: SelectItem[];
    registries: SelectItem[];
    registriesFiltered: SelectItem[];
    status: SelectItem[];
    statusFiltered: SelectItem[];
    tags: TagGroup[];
    tagsFiltered: Tag[];
    tagsSelected: Tag[];
    payments: SelectItem[];
    currentStatus: string;
    displayPanel: boolean;
    dataform: FormGroup;
    buttons: MenuItem[];
    newNumber: number;
    dateStartValue: Date;
    dateFinishValue: Date;
    amountValue: number;

    constructor(
        private router: Router,
        private translate: TranslateService,
        private sessionService: SessionService,
        private messageService: MessageService,
        private storeService: StoreService,
        private causalService: CausalService,
        private registryService: RegistryService,
        private tagService: TagService,
        private movementService: MovementService,
        private confirmationService: ConfirmationService,
        private fb: FormBuilder) {
    }

    ngOnInit() {
        this.sessionService.checkCredentials(false);
        this.sessionService.setTitle('Movements');

        this.dataform = this.fb.group({
            'number': new FormControl('', Validators.required),
            'date': new FormControl('', Validators.required),
            'description': new FormControl('', Validators.nullValidator),
            'store': new FormControl('', Validators.required),
            'causal': new FormControl('', Validators.required),
            'registry': new FormControl('', Validators.nullValidator),
            'device': new FormControl('', Validators.nullValidator),
            'tags': new FormControl('', Validators.nullValidator),
            'payment': new FormControl('', Validators.nullValidator),
            'shipping': new FormControl('', Validators.nullValidator),
            'shippingCost': new FormControl('', Validators.nullValidator),
            'status': new FormControl('', Validators.required),
            'note': new FormControl('', Validators.nullValidator)
        });

        this.buttons = []
        this.translate.get('Details').subscribe((res: string) =>
            this.buttons.push({ label: res, icon: 'pi pi-bars', command: (event) => this.openClick() }));
        this.translate.get('Edit').subscribe((res: string) =>
            this.buttons.push({ label: res, icon: 'pi pi-pencil', command: (event) => this.editClick() }));
        this.translate.get('Document').subscribe((res: string) =>
            this.buttons.push({ label: res, icon: 'pi pi-print', command: (event) => this.openClick('document/') }));
        this.translate.get('Barcode').subscribe((res: string) =>
            this.buttons.push({ label: res, icon: 'pi pi-money-bill', command: (event) => this.openClick('barcode/') }));
        this.translate.get('Create copy').subscribe((res: string) =>
            this.buttons.push({ label: res, icon: 'pi pi-clone', command: (event) => this.cloneClick() }));

        if (this.items == null) {
            this.refreshClick();
        } else {
            this.refreshControl();
        }

        this.movementService
            .getStatus()
            .subscribe(result => {
                this.status = result.map(p => Helpers.newSelectItem(p.value));
            }
        );

        this.movementService
            .getShippings()
            .subscribe(result => {
                this.shippings = result.map(p => Helpers.newSelectItem(p.id, p.value));
            }
        );

        this.movementService
            .getPayments()
            .subscribe(result => {
                this.payments = result.map(p => Helpers.newSelectItem(p.id, p.value));
            }
        );

        this.tagService
            .getAll()
            .subscribe(result => {
                this.tags = result;
            }
        );

        this.storeService
            .getAll()
            .subscribe(result => {
                this.stores = result.map(p => Helpers.newSelectItem(p, p.storeName));
            }
        );

        this.causalService
            .getAll()
            .subscribe(result => {
                this.causals = result.map(p => Helpers.newSelectItem(p, p.causalName));
                if (localStorage.getItem('zenretailDevice') === null) {
                    this.causals = this.causals.filter(p => p.value.causalIsPos === false);
                }
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

        const jsonObj: any = JSON.parse(localStorage.getItem('zenretailDevice'));
        this.device = jsonObj !== null ? <Device>jsonObj : null;
    }

    buildFilter() {
        this.translate.get('All').subscribe((res: string) => {
            this.storesFiltered = [];
            this.storesFiltered.push({label: res, value: null});
            const filterStores = Helpers.distinct(this.items.map((item: Movement) =>
                Helpers.newSelectItem(item.movementStore.storeName)));
            this.storesFiltered = this.storesFiltered.concat(filterStores);

            this.causalsFiltered = [];
            this.causalsFiltered.push({label: res, value: null});
            const filterCusals = Helpers.distinct(this.items.map((item: Movement) =>
                Helpers.newSelectItem(item.movementCausal.causalName)));
            this.causalsFiltered = this.causalsFiltered.concat(filterCusals);

            this.registriesFiltered = [];
            this.registriesFiltered.push({label: res, value: null});
            const filterRegistry = Helpers.distinct(this.items.map((item: Movement) =>
                Helpers.newSelectItem(item.movementRegistry.registryName)));
            this.registriesFiltered = this.registriesFiltered.concat(filterRegistry);

            this.statusFiltered = [];
            this.statusFiltered.push({label: res, value: null});
            const filterStatus = Helpers.distinct(this.items.map((item: Movement) =>
                Helpers.newSelectItem(item.movementStatus)));
            this.statusFiltered = this.statusFiltered.concat(filterStatus);
        });
    }

    set items(value) { this.movementService.movements = value; }
    get items(): Movement[] { return this.movementService.movements; }

    get isNew(): boolean { return this.selected == null || this.selected.movementId === 0; }

    get selectedIndex(): number { return this.items.indexOf(this.selected); }

    get getStatus(): SelectItem[] {
        if (this.selected.movementId === 0) {
            return this.status.slice(0, 1);
        }
        const index = this.status.findIndex(p => p.label === this.selected.movementStatus);
        return this.status.slice(index, 5);
    }

    refreshClick() {
        this.items = null;
        this.movementService
            .getAll()
            .subscribe(result => {
                this.items = result;
                this.refreshControl();
             }, onerror => this.messageService.add({severity: 'error', summary: '', detail: onerror._body})
        );
    }

    private refreshControl() {
        this.totalRecords = this.items.length;
        this.buildFilter();
    }

    addClick() {
        this.selected = new Movement();
        this.currentStatus = this.selected.movementStatus;
        this.selected.movementUser = localStorage.getItem('uniqueID');
        if (this.stores.length > 0) {
            this.selected.movementStore = this.stores[0].value;
        }
        if (this.causals.length > 0) {
            this.selected.movementCausal = this.device ? this.causals.find(p => p.value.causalIsPos).value : this.causals[0].value;
            this.onCausalChange(null);
        }
        if (this.registries.length > 0) {
            this.selected.movementRegistry = this.registries[0].value;
        }
        if (this.status.length > 0) {
            this.selected.movementStatus = this.status[0].value;
        }
        this.tagsSelected = [];
        this.displayPanel = true;
    }

    onCausalChange(event: any) {
        if (this.selected.movementCausal.causalIsPos && this.device !== null) {
            this.selected.movementDevice = this.device.deviceName;
            this.selected.movementStore = this.device.store;
        } else {
            this.selected.movementDevice = '';
        }
        this.tagsSelected = [];
    }

    onShippingChange(event: any) {
        if (event.value === 'none') {
            this.selected.movementShippingCost = 0.0;
            return;
        }
        this.movementService
            .getShippingCost(this.selected.movementId, event.value)
            .subscribe(result => this.selected.movementShippingCost = result.value);
    }

    editClick() {
        if (!this.selected) {
            return;
        }
        this.tagsSelected = this.selected.movementTags;
        this.currentStatus = this.selected.movementStatus;
        this.displayPanel = true;
    }

    closeClick() {
        this.displayPanel = false;
        this.selected = null;
        this.currentStatus = null;
        this.buildFilter();
    }

    saveClick() {
        this.selected.movementTags = this.tagsSelected;
        if (this.isNew) {
            this.movementService.create(this.selected)
                .subscribe(result => {
                    this.selected = result;
                    this.items.push(this.selected);
                    this.totalRecords++;
                    this.openClick();
                }, onerror => this.messageService.add({severity: 'error', summary: '', detail: onerror._body}));
        } else {
            this.movementService.update(this.selected.movementId, this.selected)
                .subscribe(result => {
                    this.items[this.selectedIndex] = result;
                    this.closeClick();
                }, onerror => {
                    this.selected.movementStatus = this.currentStatus;
                    this.messageService.add({severity: 'error', summary: '', detail: onerror._body});
                });
        }
    }

    deleteClick() {
        if (!this.selected) {
            return;
        }
        this.translate.get('Are you sure that you want to delete this movement?').subscribe((res: string) =>
            this.confirmationService.confirm({
                message: res,
                accept: () => {
                    this.movementService.delete(this.selected.movementId)
                        .subscribe(result => {
                            this.items.splice(this.selectedIndex, 1);
                            this.totalRecords--;
                            this.closeClick();
                        }, onerror => this.messageService.add({severity: 'error', summary: '', detail: onerror._body}));
                }
            })
        );
    }

    cloneClick() {
        if (!this.selected) {
            return;
        }
        this.translate.get('Are you sure that you want to create a copy of this movement?').subscribe((res: string) =>
            this.confirmationService.confirm({
                message: res,
                accept: () => {
                    this.movementService.clone(this.selected.movementId)
                        .subscribe(result => {
                            this.selected = result;
                            this.items.push(this.selected);
                            this.editClick();
                        }, onerror => this.messageService.add({severity: 'error', summary: '', detail: onerror._body}));
                }
            })
        );
    }

    openClick(detail = '') {
        if (!this.selected) {
            return;
        }
        this.router.navigateByUrl('movement/' + detail + this.selected.movementId);
    }

    // openBarcodeClick() {
    //     if (!this.selected) {
    //         return;
    //     }
    //     this.movementService
    //         .getBarcode(this.selected.movementId)
    //         .subscribe(
    //             data => {
    //                 const blob = new Blob([data], {type: 'application/pdf'});
    //                 const filename = 'barcode_' + this.selected.movementNumber + '_' + this.selected.movementDate + '.pdf';
    //                 FileSaver.saveAs(blob, filename);
    //                 // const url = window.URL.createObjectURL(blob);
    //                 // window.location.href = url;
    //             },
    //             err => console.error(err),
    //         () => console.log('done')
    //     );
    // }

    filterTags(event) {
        this.tagsFiltered = [];
        this.tags.forEach(p => {
            if (event.query === ' ' || p.tagGroupName.toLowerCase().indexOf(event.query.toLowerCase()) === 0
                || p.values.find(e => e.tagValueName.toLowerCase().indexOf(event.query.toLowerCase()) === 0)) {
                p.values.forEach(f => {
                    const tag = <Tag>{
                        groupId: f.tagGroupId,
                        groupName: p.tagGroupName,
                        valueId: f.tagValueId,
                        valueName: f.tagValueName
                    };
                    this.tagsFiltered.push(tag);
                });
            }
        });
    }
}

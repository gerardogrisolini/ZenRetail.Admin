import { Component, Input, EventEmitter, ViewChild, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DataTable, SelectItem, MenuItem } from 'primeng/primeng';
import { MessageService } from 'primeng/components/common/messageservice';
import { Movement } from './models';
import { Helpers } from './helpers';
import { MovementService } from './../services/movement.service';

@Component({
    selector: 'movement-picker',
    templateUrl: 'movement-picker.component.html'
})

export class MovementPickerComponent {
    @Output() onPicked = new EventEmitter();
    @ViewChild('dt') datatable: DataTable;
    public helpers = Helpers;
    totalRecords = 0;
    selected: Movement[];
    stores: SelectItem[];
    storesFiltered: SelectItem[];
    causals: SelectItem[];
    causalsFiltered: SelectItem[];
    dateStartValue: Date;
    dateFinishValue: Date;
    public isOpen: boolean;

    constructor(
        private messageService: MessageService,
        private translate: TranslateService,
        private movementService: MovementService) {
        this.isOpen = false;
    }

    set movements(value) { this.movementService.movements = value; }
    get movements(): Movement[] { return this.movementService.movements; }

    public loadData(registryId: number) {
        if (!this.movements) {
            this.reloadData(registryId);
        } else {
            this.refreshControl();
        }
    }

    private reloadData(registryId: number) {
        this.isOpen = true;
        this.movementService
            .getByRegistryId(registryId)
            .subscribe(result => {
                this.movements = result;
                this.refreshControl();
            }, onerror => this.messageService.add({ severity: 'error', summary: '', detail: onerror._body }));
    }

    private refreshControl() {
        this.totalRecords = this.movements.length;
        this.buildFilter(this.movements);
    }

    hidePickerClick() {
        this.isOpen = false;
    }

    pickerClick() {
        const data: number[] = [];
        this.selected.forEach(e => data.push(e.movementId));
        this.onPicked.emit(data);
        this.isOpen = false;
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
}

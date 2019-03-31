import { Component, OnInit, Input } from '@angular/core';
import { MessageService } from 'primeng/components/common/messageservice';
import { SessionService } from './../services/session.service';
import { MovementService } from './../services/movement.service';
import { Whouse } from './../shared/models';
import { Helpers } from '../shared/helpers';

@Component({
    selector: 'app-whouse-component',
    templateUrl: 'whouse.component.html'
})

export class WhouseComponent implements OnInit {
    public helpers = Helpers;
    private date: Date;
    items: Whouse[];
    totalItems = 0;
    loaded = 0;
    unloaded = 0;
    stock = 0;

    constructor(private messageService: MessageService,
                private sessionService: SessionService,
                private movementService: MovementService) {
    }

    ngOnInit() {
        this.sessionService.checkCredentials(true);
        this.sessionService.setTitle('Warehouse');

        this.date = new Date();
        this.items = [];
    }

    @Input() set dateValue(value: Date) {
        this.date = value;
    }
    get dateValue(): Date {
        return this.date;
    }

    getData() {
        this.items = null;
        this.movementService
            .getWhouse(this.date, 0)
            .subscribe(result => {
                this.items = result;
                this.totalItems = this.items.length;
                this.loaded = this.items.map(p => p.loaded).reduce((sum, current) => sum + current);
                this.unloaded = this.items.map(p => p.unloaded).reduce((sum, current) => sum + current);
                this.stock = this.loaded - this.unloaded;
            }, onerror => this.messageService.add({severity: 'error', summary: '', detail: onerror._body})
        );
    }
}

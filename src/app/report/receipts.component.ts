import { Component, OnInit, Input } from '@angular/core';
import { MessageService } from 'primeng/components/common/messageservice';
import { SessionService } from './../services/session.service';
import { MovementService } from './../services/movement.service';
import { Movement, Period } from './../shared/models';
import { DateFilterPipe } from './../pipes/date-filter.pipe';
import { Helpers } from '../shared/helpers';

@Component({
    selector: 'app-reportreceipts-component',
    templateUrl: 'receipts.component.html'
})

export class ReportReceiptsComponent implements OnInit {
    public helpers = Helpers;
    totalItems = 0;
    totalAmount = 0.0;
    items: Movement[];
    private period: Period;

    constructor(private messageService: MessageService,
                private sessionService: SessionService,
                private movementService: MovementService) {
    }

    ngOnInit() {
        this.sessionService.checkCredentials(false);
        this.sessionService.setTitle('Receipts');
        this.period = new Period();
        this.getData();
    }

    @Input() set dateStartValue(value: Date) {
        this.period.start = value;
    }
    get dateStartValue(): Date {
        return this.period.start;
    }

    @Input() set dateFinishValue(value: Date) {
        this.period.finish = value;
    }
    get dateFinishValue(): Date {
        return this.period.finish;
    }

    calculateGroupTotal(device: string) {
        let total = 0;
        if (this.items) {
            for (const movemet of this.items) {
                if (movemet.movementDevice === device) {
                    total += movemet.movementAmount;
                }
            }
        }
        return total;
    }

    updateTotals() {
        this.totalItems = this.items.length;
        if (this.totalItems > 0) {
            this.totalAmount = this.items.map(p => p.movementAmount).reduce((sum, current) => sum + current);
        }
    }

    getData() {
        this.movementService
            .getReceipted(this.period)
            .subscribe(result => {
                this.items = result;
                this.updateTotals();
            }, onerror => this.messageService.add({severity: 'error', summary: '', detail: onerror._body})
        );
    }
}

import { Component, OnInit, Input } from '@angular/core';
import { OverlayPanel } from 'primeng/primeng';
import { MessageService } from 'primeng/components/common/messageservice';
import { SessionService } from './../services/session.service';
import { MwsRequest } from './../shared/models';
import { AmazonService } from '../services/amazon.service';

@Component({
    selector: 'app-request-component',
    templateUrl: 'request.component.html'
})

export class RequestComponent implements OnInit {
    totalRecords = 0;
    items: MwsRequest[];
    xml: string;

    constructor(private messageService: MessageService,
                private sessionService: SessionService,
                private amazonService: AmazonService) {
    }

    ngOnInit() {
        this.sessionService.checkCredentials(false);
        this.sessionService.setTitle('Amazon requests');
        this.refreshClick();
    }

    refreshClick() {
        this.amazonService
            .get()
            .subscribe(result => {
                this.items = result;
                this.totalRecords = this.items.filter(p => p.requestCompletedAt === 0).length;
            }, onerror => this.messageService.add({severity: 'error', summary: 'Error', detail: onerror._body})
        );
    }

    selectXml(event, xml: string, overlaypanel: OverlayPanel) {
        this.xml = xml;
        overlaypanel.toggle(event);
    }

    // deleteClick(requestSubmissionId: string) {
    //     this.confirmationService.confirm({
    //         message: 'Are you sure that you want to cancel this request?',
    //         accept: () => {
    //             this.amazonService
    //                 .delete(requestSubmissionId)
    //                 .subscribe(result => {
    //                     // this.items.splice(this.selectedIndex, 1);
    //                     this.totalRecords--;
    //                 }, onerror => this.messageService.add({severity: 'error', summary: 'Error', detail: onerror._body}));
    //         }
    //     });
    // }
}

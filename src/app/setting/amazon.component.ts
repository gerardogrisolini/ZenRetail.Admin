import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/components/common/messageservice';
import { SessionService } from './../services/session.service';
import { MwsConfig } from './../shared/models';
import { AmazonService } from '../services/amazon.service';

@Component({
    selector: 'app-amazon-component',
    templateUrl: 'amazon.component.html'
})

export class AmazonComponent implements OnInit {
    config: MwsConfig;

    constructor(private messageService: MessageService,
                private sessionService: SessionService,
                private amazonService: AmazonService) {
    }

    ngOnInit() {
        this.sessionService.checkCredentials(false);
        this.sessionService.setTitle('Amazon');

        this.amazonService
            .getConfig()
            .subscribe(result => {
                this.config = result;
            }, onerror => this.messageService.add({severity: 'error', summary: '', detail: onerror._body})
        );
    }

    saveClick() {
        this.amazonService
            .updateConfig(this.config)
            .subscribe(result => {
                this.config = result;
                this.messageService.add({severity: 'success', summary: '', detail: 'Successfully saved!'});
            }, onerror => this.messageService.add({severity: 'error', summary: '', detail: onerror._body})
        );
    }
}

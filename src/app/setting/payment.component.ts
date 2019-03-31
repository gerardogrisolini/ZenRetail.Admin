import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { MessageService } from 'primeng/components/common/messageservice';
import { SelectItem } from 'primeng/primeng';
import { SessionService } from '../services/session.service';
import { CompanyService } from '../services/company.service';
import { Company } from '../shared/models';
import { Helpers } from '../shared/helpers';

@Component({
    selector: 'app-payment-component',
    templateUrl: 'payment.component.html'
})

export class PaymentComponent implements OnInit {
    company: Company;
    dataform: FormGroup;
    paypalEnvs: SelectItem[];

    constructor(
        private sessionService: SessionService,
        private translate: TranslateService,
        private messageService: MessageService,
        private companyService: CompanyService,
        private fb: FormBuilder) {
        this.paypalEnvs = [];
        this.translate.get('Sandbox').subscribe((res: string) =>
            this.paypalEnvs.push(Helpers.newSelectItem('sandbox', res)));
        this.translate.get('Production').subscribe((res: string) =>
            this.paypalEnvs.push(Helpers.newSelectItem('production', res)));
    }

    ngOnInit() {
        this.sessionService.checkCredentials(false);
        this.sessionService.setTitle('Payment');

        this.dataform = this.fb.group({
            'bankName': new FormControl('', Validators.nullValidator),
            'bankIban': new FormControl('', Validators.nullValidator),
            'paypalEnv': new FormControl('', Validators.nullValidator),
            'paypalSandbox': new FormControl('', Validators.nullValidator),
            'paypalProduction': new FormControl('', Validators.nullValidator),
            'cashOnDelivery': new FormControl('', Validators.nullValidator)
        });

        this.companyService.get()
            .subscribe(result => {
                this.company = result;
            }, onerror => this.messageService.add({severity: 'error', summary: '', detail: onerror._body})
        );
    }

    saveClick() {
        this.companyService
            .save(this.company)
            .subscribe(result => {
                this.company = result;
                this.translate.get('Payment saved!').subscribe((res: string) =>
                    this.messageService.add({severity: 'success', summary: '', detail: res}));
            }, onerror => this.messageService.add({severity: 'error', summary: '', detail: onerror._body}));
    }
}

import { Component, OnInit } from '@angular/core';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { MessageService } from 'primeng/components/common/messageservice';
import { SessionService } from './../services/session.service';
import { AccountService } from './../services/account.service';
import { Account } from './../shared/models';

@Component({
    selector: 'app-myinfo-component',
    templateUrl: 'myinfo.component.html'
})

export class MyInfoComponent implements OnInit {
    public myinfo: Account;
    dataform: FormGroup;

    constructor(private messageService: MessageService,
                private sessionService: SessionService,
                private accountService: AccountService,
                private fb: FormBuilder) {
    }

    ngOnInit() {
        this.sessionService.setTitle('Account');
        this.sessionService.getCredentials()
            .subscribe(p => {
                this.accountService.getById(p.uniqueID)
                    .subscribe(account => {
                        this.myinfo = account;
                    });
            }, onerror => this.messageService.add({severity: 'error', summary: '', detail: onerror._body}));

        this.dataform = this.fb.group({
            'firstname': new FormControl('', Validators.required),
            'lastname': new FormControl('', Validators.required),
            'email': new FormControl('', Validators.required),
            'username': new FormControl('', Validators.required),
            'password': new FormControl('', Validators.compose([Validators.required, Validators.minLength(6)]))
        });
    }

    saveClick() {
        this.accountService
            .update(this.myinfo.uniqueID, this.myinfo)
            .subscribe(result => { });
    }
}

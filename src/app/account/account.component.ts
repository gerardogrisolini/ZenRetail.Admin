import { Component, OnInit } from '@angular/core';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/primeng';
import { MessageService } from 'primeng/components/common/messageservice';
import { SessionService } from './../services/session.service';
import { AccountService } from './../services/account.service';
import { Account } from './../shared/models';
import { Helpers } from './../shared/helpers';

@Component({
    selector: 'app-account-component',
    templateUrl: 'account.component.html'
})

export class AccountComponent implements OnInit {
    totalRecords = 0;
    accounts: Account[];
    selected: Account;
    displayPanel: boolean;
    dataform: FormGroup;

    constructor(private messageService: MessageService,
        private translate: TranslateService,
        private sessionService: SessionService,
        private accountService: AccountService,
        private confirmationService: ConfirmationService,
        private fb: FormBuilder) {
    }

    ngOnInit() {
        this.sessionService.checkCredentials(true);
        this.sessionService.setTitle('Accounts');

        this.dataform = this.fb.group({
            'firstname': new FormControl('', Validators.required),
            'lastname': new FormControl('', Validators.required),
            'email': new FormControl('', Validators.required),
            'username': new FormControl('', Validators.required),
            'password': new FormControl('', Validators.compose([Validators.required, Validators.minLength(6)])),
            'isAdmin': new FormControl('', Validators.required),
        });

        this.accountService.getAll()
            .subscribe(result => {
                this.accounts = result;
                this.totalRecords = this.accounts.length;
            }, onerror => this.messageService.add({severity: 'error', summary: '', detail: onerror._body})
        );
    }

    get isNew(): boolean { return this.selected == null || this.selected.uniqueID === ''; }

    get selectedIndex(): number { return this.accounts.indexOf(this.selected); }

    onRowSelect(event: any) {
        this.displayPanel = true;
    }

    closeClick() {
        this.displayPanel = false;
        this.selected = null;
    }

    addClick() {
        this.selected = new Account();
        this.displayPanel = true;
    }

    saveClick() {
        if (this.isNew) {
            this.accountService
                .create(this.selected)
                .subscribe(result => {
                    this.accounts.push(result);
                    this.totalRecords++;
                   this.closeClick();
                }, onerror => this.messageService.add({severity: 'error', summary: '', detail: onerror._body}));
        } else {
            this.accountService
                .update(this.selected.uniqueID, this.selected)
                .subscribe(result => {
                    this.closeClick();
                }, onerror => this.messageService.add({severity: 'error', summary: '', detail: onerror._body}));
        }
    }

    deleteClick() {
        this.translate.get('Are you sure that you want to delete this account?')
            .subscribe((res: string) => this.confirmationService.confirm({
                message: res,
                accept: () => {
                    this.accountService
                    .delete(this.selected.uniqueID)
                    .subscribe(result => {
                        this.accounts.splice(this.selectedIndex, 1);
                        this.totalRecords--;
                        this.closeClick();
                    }, onerror => this.messageService.add({severity: 'error', summary: '', detail: onerror._body}));
                }
            })
        );
    }
}

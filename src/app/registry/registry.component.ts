import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { ConfirmationService, Paginator } from 'primeng/primeng';
import { MessageService } from 'primeng/components/common/messageservice';
import { SessionService } from './../services/session.service';
import { RegistryService } from './../services/registry.service';
import { Registry } from './../shared/models';
import { Helpers } from './../shared/helpers';

@Component({
    selector: 'app-registry-component',
    templateUrl: 'registry.component.html'
})

export class RegistryComponent implements OnInit {
    totalRecords = 0;
    registries: Registry[];
    selected: Registry;
    displayPanel: boolean;
    dataform: FormGroup;

    constructor(private messageService: MessageService,
        private translate: TranslateService,
        private sessionService: SessionService,
        private registryService: RegistryService,
        private confirmationService: ConfirmationService,
        private fb: FormBuilder) {
    }

    ngOnInit() {
        this.sessionService.checkCredentials(false);
        this.sessionService.setTitle('Registries');

        this.dataform = this.fb.group({
            'name': new FormControl('', Validators.required),
            'email': new FormControl('', [Validators.required, Validators.email]),
            // 'password': new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]),
            'phone': new FormControl('', Validators.required),
            'address': new FormControl('', Validators.required),
            'city': new FormControl('', Validators.required),
            'zip': new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(5)]),
            'province': new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(2)]),
            'country': new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(3)]),
            'fiscalCode': new FormControl('', [Validators.required, Validators.minLength(16), Validators.maxLength(16)]),
            'vatNumber': new FormControl('', [Validators.nullValidator, Validators.minLength(11), Validators.maxLength(11)])
        });

        this.registryService.getAll()
            .subscribe(result => {
                this.registries = result;
                this.totalRecords = this.registries.length;
            }, onerror => this.messageService.add({severity: 'error', summary: '', detail: onerror._body})
        );
    }

    get isNew(): boolean { return this.selected == null || this.selected.registryId === 0; }

    get selectedIndex(): number { return this.registries.indexOf(this.selected); }

    onRowSelect(event: any) {
        this.displayPanel = true;
    }

    closeClick() {
        this.displayPanel = false;
        this.selected = null;
    }

    addClick() {
        this.selected = new Registry();
        this.displayPanel = true;
    }

    saveClick() {
        if (this.isNew) {
            this.registryService
                .create(this.selected)
                .subscribe(result => {
                    this.registries.push(result);
                    this.totalRecords++;
                    this.closeClick();
                }, onerror => this.messageService.add({severity: 'error', summary: '', detail: onerror._body}));
        } else {
            this.registryService
                .update(this.selected.registryId, this.selected)
                .subscribe(result => {
                    this.registries[this.selectedIndex] = this.selected;
                    this.closeClick();
                }, onerror => this.messageService.add({severity: 'error', summary: '', detail: onerror._body}));
        }
    }

    deleteClick() {
        this.translate.get('Are you sure that you want to remove this registry?').subscribe((res: string) =>
            this.confirmationService.confirm({
                message: res,
                accept: () => {
                    this.registryService
                        .delete(this.selected.registryId)
                        .subscribe(result => {
                            this.registries.splice(this.selectedIndex, 1);
                            this.totalRecords--;
                            this.closeClick();
                        }, onerror => this.messageService.add({severity: 'error', summary: '', detail: onerror._body}));
                }
            })
        );
    }
}

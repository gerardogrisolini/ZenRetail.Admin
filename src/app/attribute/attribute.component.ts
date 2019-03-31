import { Component, OnInit, Input } from '@angular/core';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/primeng';
import { MessageService } from 'primeng/components/common/messageservice';
import { SessionService } from './../services/session.service';
import { AttributeService } from './../services/attribute.service';
import { Attribute, AttributeValue } from './../shared/models';
import { Helpers } from './../shared/helpers';

@Component({
    selector: 'app-attribute',
    templateUrl: 'attribute.component.html'
})

export class AttributeComponent implements OnInit {
    totalRecords = 0;
    attributes: Attribute[];
    dataform: FormGroup;
    display: boolean;

    constructor(private messageService: MessageService,
                private translate: TranslateService,
                private sessionService: SessionService,
                private attributeService: AttributeService,
                private confirmationService: ConfirmationService,
                private fb: FormBuilder) {
    }

    set selected(value) { this.attributeService.selected = value; }
    get selected(): Attribute { return this.attributeService.selected; }
    get isNew(): boolean { return this.selected == null || this.selected.attributeId === 0; }
    get selectedIndex(): number { return this.attributes.indexOf(this.selected); }

    ngOnInit() {
        this.sessionService.checkCredentials(false);
        this.sessionService.setTitle('Attributes');

        this.dataform = this.fb.group({
            'name': new FormControl('', Validators.required)
        });

        this.attributeService
            .getAll()
            .subscribe(result => {
                this.attributes = result;
                this.totalRecords = this.attributes.length;
            }
        );
    }

    onRowSelect(event: any) {
        this.attributeService.values = [];
        this.attributeService
            .getValueByAttributeId(this.selected.attributeId)
            .subscribe(result => {
                this.attributeService.values = result;
            }, onerror => this.messageService.add({severity: 'error', summary: '', detail: onerror._body}));
    }

    addClick() {
        this.selected = new Attribute(0, '', []);
        this.display = true;
    }

    editClick() {
        this.display = true;
    }

    closeClick() {
        this.display = false;
        this.selected = null;
    }

    saveClick() {
        if (this.isNew) {
            this.attributeService
                .create(this.selected)
                .subscribe(result => {
                    this.attributes.push(result);
                    this.closeClick();
                }, onerror => this.messageService.add({severity: 'error', summary: '', detail: onerror._body}));
        } else {
            this.attributeService
                .update(this.selected.attributeId, this.selected)
                .subscribe(result => {
                    this.closeClick();
                }, onerror => this.messageService.add({severity: 'error', summary: '', detail: onerror._body}));
        }
    }

    deleteClick() {
        this.translate.get('All values of this attribute and related articles will be deleted. Are you sure to delete this attribute?')
            .subscribe((res: string) => this.confirmationService.confirm({
                message: res,
                accept: () => {
                    this.attributeService
                        .delete(this.selected.attributeId)
                        .subscribe(result => {
                            this.attributes.splice(this.selectedIndex, 1);
                            this.totalRecords--;
                            this.selected = null;
                            this.attributeService.values.length = 0;
                            this.closeClick();
                        }, onerror => this.messageService.add({severity: 'error', summary: '', detail: onerror._body}));
                }
            })
        );
    }
}

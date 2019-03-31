import { Component, OnInit, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { ConfirmationService } from 'primeng/primeng';
import { MessageService } from 'primeng/components/common/messageservice';
import { SessionService } from './../services/session.service';
import { TagService } from './../services/tag.service';
import { TagGroup, TagValue } from './../shared/models';
import { Helpers } from './../shared/helpers';

@Component({
    selector: 'app-tag-component',
    templateUrl: 'tag.component.html'
})

export class TagComponent implements OnInit {
    totalRecords = 0;
    totalValues = 0;
    tags: TagGroup[];
    values: TagValue[];
    selected: TagGroup;
    selectedValue: TagValue;
    displayPanel: boolean;
    displayPanelValue: boolean;
    dataform: FormGroup;
    dataformValue: FormGroup;

    constructor(
        private messageService: MessageService,
        private translate: TranslateService,
        private sessionService: SessionService,
        private tagService: TagService,
        private confirmationService: ConfirmationService,
        private fb: FormBuilder) {
    }

    ngOnInit() {
        this.sessionService.checkCredentials(false);
        this.sessionService.setTitle('Tags');

        this.dataform = this.fb.group({
            'name': new FormControl('', Validators.required)
        });

        this.dataformValue = this.fb.group({
            'code': new FormControl('', [Validators.required, Validators.maxLength(6)]),
            'name': new FormControl('', Validators.required)
        });

        this.tagService
            .get()
            .subscribe(result => {
                this.tags = result;
                this.totalRecords = this.tags.length;
            }
        );
    }

    get isNew(): boolean { return this.selected == null || this.selected.tagGroupId === 0; }

    get isNewValue(): boolean { return this.selectedValue == null || this.selectedValue.tagValueId === 0; }

    get selectedIndex(): number { return this.tags.indexOf(this.selected); }

    get selectedValueIndex(): number { return this.values.indexOf(this.selectedValue); }

    onRowSelect(event: any) {
        this.values = null;
        this.tagService
            .getValueByTagId(this.selected.tagGroupId)
            .subscribe(result => {
                this.values = result;
                this.totalValues = this.values.length;
            }, onerror => this.messageService.add({severity: 'error', summary: '', detail: onerror._body}));
    }

    addClick() {
        this.selected = new TagGroup(0, '', [], []);
        this.displayPanel = true;
    }

    editClick() {
        this.displayPanel = true;
    }

    closeClick() {
        this.displayPanel = false;
    }

    saveClick() {
        if (this.isNew) {
            this.tagService
                .create(this.selected)
                .subscribe(result => {
                    this.tags.push(result);
                    this.displayPanel = false;
                }, onerror => this.messageService.add({severity: 'error', summary: '', detail: onerror._body}));
        } else {
            this.tagService
                .update(this.selected.tagGroupId, this.selected)
                .subscribe(result => {
                    this.displayPanel = false;
                }, onerror => this.messageService.add({severity: 'error', summary: '', detail: onerror._body}));
        }
    }

    deleteClick() {
        this.translate
            .get('All values of this tag and related articles will be deleted. Are you sure that you want to delete this tag?')
            .subscribe((res: string) =>
                this.confirmationService.confirm({
                message: res,
                accept: () => {
                    this.tagService
                        .delete(this.selected.tagGroupId)
                        .subscribe(result => {
                            this.tags.splice(this.selectedIndex, 1);
                            this.totalRecords--;
                            this.selected = null;
                            this.values.length = 0;
                            this.displayPanel = false;
                        }, onerror => this.messageService.add({severity: 'error', summary: '', detail: onerror._body}));
                }
            })
        );
    }

    onRowValueSelect(event: any) {
        this.displayPanelValue = true;
    }

    addValueClick() {
        if (this.selected && this.selected.tagGroupId > 0) {
            this.selectedValue = new TagValue(this.selected.tagGroupId, 0, '', '', []);
            this.displayPanelValue = true;
        } else {
            this.translate.get('Select a tag before add value!').subscribe((res: string) => alert(res));
        }
    }

    editValueClick() {
        this.displayPanelValue = true;
    }

    closeValueClick() {
        this.displayPanelValue = false;
        this.selectedValue = null;
    }

    saveValueClick() {
        if (this.isNewValue) {
            this.tagService
                .createValue(this.selectedValue)
                .subscribe(result => {
                    this.values.push(result);
                    this.closeValueClick();
                }, onerror => this.messageService.add({severity: 'error', summary: '', detail: onerror._body}));
        } else {
            this.tagService
                .updateValue(this.selectedValue.tagValueId, this.selectedValue)
                .subscribe(result => {
                    this.closeValueClick();
                }, onerror => this.messageService.add({severity: 'error', summary: '', detail: onerror._body}));
        }
    }

    deleteValueClick() {
        this.translate
            .get('All related articles of this tag value will be deleted. Are you sure that you want to delete this tag value?')
            .subscribe((res: string) =>
                this.confirmationService.confirm({
                    message: res,
                    accept: () => {
                        this.tagService
                            .deleteValue(this.selectedValue.tagValueId)
                            .subscribe(result => {
                                this.values.splice(this.selectedValueIndex, 1);
                                this.totalValues--;
                                this.closeValueClick();
                            }, onerror => this.messageService.add({severity: 'error', summary: '', detail: onerror._body}));
                    }
                })
            );
    }
}

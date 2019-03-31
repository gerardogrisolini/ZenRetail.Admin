import { Component, OnInit, Input } from '@angular/core';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/primeng';
import { MessageService } from 'primeng/components/common/messageservice';
import { SessionService } from './../services/session.service';
import { BrandService } from './../services/brand.service';
import { Brand } from './../shared/models';

@Component({
    selector: 'app-brand',
    templateUrl: 'brand.component.html'
})

export class BrandComponent implements OnInit {
    totalRecords = 0;
    brands: Brand[];
    selected: Brand;
    dataform: FormGroup;

    constructor(private messageService: MessageService,
        private translate: TranslateService,
        private sessionService: SessionService,
        private brandService: BrandService,
        private confirmationService: ConfirmationService,
        private fb: FormBuilder) {
    }

    ngOnInit() {
        this.sessionService.checkCredentials(false);
        this.sessionService.setTitle('Brands');

        this.dataform = this.fb.group({
            'name': new FormControl('', Validators.required)
        });

        this.brandService
            .getAll()
            .subscribe(result => {
                this.brands = result;
                this.totalRecords = this.brands.length;
            }, onerror => this.messageService.add({severity: 'error', summary: '', detail: onerror._body})
        );
    }

    get isNew(): boolean { return this.selected == null || this.selected.brandId === 0; }

    get selectedIndex(): number { return this.brands.indexOf(this.selected); }

    addClick() {
        this.selected = new Brand();
    }

    closeClick() {
        this.selected = null;
    }

    saveClick() {
        if (this.isNew) {
            this.brandService
                .create(this.selected)
                .subscribe(result => {
                    this.brands.push(result);
                    this.totalRecords++;
                    this.closeClick();
                }, onerror => this.messageService.add({severity: 'error', summary: '', detail: onerror._body}));
        } else {
            this.brandService
                .update(this.selected.brandId, this.selected)
                .subscribe(result => {
                    this.closeClick();
                }, onerror => this.messageService.add({severity: 'error', summary: '', detail: onerror._body}));
        }
    }

    deleteClick() {
        this.translate.get('All related products will be deleted. Are you sure that you want to delete this brand?')
            .subscribe((res: string) => this.confirmationService.confirm({
                message: res,
                accept: () => {
                    this.brandService
                    .delete(this.selected.brandId)
                    .subscribe(result => {
                        this.brands.splice(this.selectedIndex, 1);
                        this.totalRecords--;
                        this.closeClick();
                    }, onerror => this.messageService.add({severity: 'error', summary: '', detail: onerror._body}));
                }
            })
        );
    }
}

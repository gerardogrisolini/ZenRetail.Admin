import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/primeng';
import { MessageService } from 'primeng/components/common/messageservice';
import { SessionService } from './../services/session.service';
import { BrandService } from './../services/brand.service';
import { Brand, Media } from './../shared/models';

@Component({
    selector: 'app-brand',
    templateUrl: 'brand.component.html'
})

export class BrandComponent implements OnInit {
    totalRecords = 0;
    brands: Brand[];
    selected: Brand;
    cols: any[];

    constructor(private messageService: MessageService,
        private translate: TranslateService,
        private sessionService: SessionService,
        private brandService: BrandService,
        private confirmationService: ConfirmationService) {
        this.cols = [
            { field: 'brandId', header: 'Id' },
            { field: 'brandName', header: 'Name' },
            { field: 'media.name', header: 'Media' }
        ]; 
    }

    ngOnInit() {
        this.sessionService.checkCredentials(false);
        this.sessionService.setTitle('Brands');

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

    onRowSelect(event: any) {
        if (!this.selected.media) {
            this.selected.media = new Media();
        }
    }

    saveClick() {
        if (this.selected.media.name === '') {
            this.selected.media = null;
        }
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

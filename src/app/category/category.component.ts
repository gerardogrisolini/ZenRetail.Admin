import { Component, OnInit } from '@angular/core';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/primeng';
import { MessageService } from 'primeng/components/common/messageservice';
import { SessionService } from './../services/session.service';
import { CategoryService } from './../services/category.service';
import { Category } from './../shared/models';

@Component({
    selector: 'app-category',
    templateUrl: 'category.component.html'
})

export class CategoryComponent implements OnInit {
    totalRecords = 0;
    categories: Category[];
    selected: Category;
    dataform: FormGroup;

    constructor(
        private messageService: MessageService,
        private translate: TranslateService,
        private sessionService: SessionService,
        private categoryService: CategoryService,
        private confirmationService: ConfirmationService,
        private fb: FormBuilder) {
    }

    ngOnInit() {
        this.sessionService.checkCredentials(false);
        this.sessionService.setTitle('Categories');

        this.dataform = this.fb.group({
            'name': new FormControl('', Validators.required),
            'isPrimary': new FormControl('', Validators.required)
        });

        this.categoryService
            .getAll()
            .subscribe(result => {
                this.categories = result;
                this.totalRecords = this.categories.length;
            }, onerror => this.messageService.add({severity: 'error', summary: '', detail: onerror._body})
        );
    }

    get isNew(): boolean { return this.selected == null || this.selected.categoryId === 0; }

    get selectedIndex(): number { return this.categories.indexOf(this.selected); }

    addClick() {
        this.selected = new Category(0, '');
    }

    closeClick() {
        this.selected = null;
    }

    saveClick() {
        if (this.isNew) {
            this.categoryService
                .create(this.selected)
                .subscribe(result => {
                    this.categories.push(result);
                    this.totalRecords++;
                    this.closeClick();
                }, onerror => this.messageService.add({severity: 'error', summary: '', detail: onerror._body}));
        } else {
            this.categoryService
                .update(this.selected.categoryId, this.selected)
                .subscribe(result => {
                    this.closeClick();
                }, onerror => this.messageService.add({severity: 'error', summary: '', detail: onerror._body}));
        }
    }

    deleteClick() {
        this.translate.get('All associations with the products will be deleted. Are you sure that you want to delete this category?')
            .subscribe((res: string) => this.confirmationService.confirm({
                message: res,
                accept: () => {
                    this.categoryService
                    .delete(this.selected.categoryId)
                    .subscribe(result => {
                        this.categories.splice(this.selectedIndex, 1);
                        this.totalRecords--;
                        this.closeClick();
                    }, onerror => this.messageService.add({severity: 'error', summary: '', detail: onerror._body}));
                }
            })
        );
    }
}

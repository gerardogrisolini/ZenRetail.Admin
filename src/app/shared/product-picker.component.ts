import { Component, Input, EventEmitter, ViewChild, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DataTable, SelectItem, MenuItem } from 'primeng/primeng';
import { MessageService } from 'primeng/components/common/messageservice';
import { Product, ProductCategory } from './models';
import { Helpers } from './helpers';
import { ProductService } from './../services/product.service';

@Component({
    selector: 'product-picker',
    templateUrl: 'product-picker.component.html'
})

export class ProductPickerComponent {
    @Output() onPicked = new EventEmitter();
    @ViewChild('dt') datatable: DataTable;
    totalRecords = 0;
    selected: Product[];
    categories: SelectItem[];
    allbrands: SelectItem[];
    brands: SelectItem[];
    categoryValue: string;
    sliderValue: number;
    public isOpen: boolean;

    constructor(
        private messageService: MessageService,
        private translate: TranslateService,
        private productService: ProductService) {
        this.isOpen = false;
    }

    set products(value) { this.productService.products = value; }
    get products(): Product[] { return this.productService.products; }

    public loadData() {
        if (!this.products) {
            this.reloadData();
        } else {
            this.refreshControl();
        }
    }

    private reloadData() {
        this.isOpen = true;
        this.productService
            .getProducts()
            .subscribe(result => {
                this.products = result;
                this.refreshControl();
            }, onerror => this.messageService.add({ severity: 'error', summary: '', detail: onerror._body }));
    }

    private refreshControl() {
        this.totalRecords = this.products.length;
        this.buildFilter(this.products);
    }

    hidePickerClick() {
        this.isOpen = false;
    }

    pickerClick() {
        const data: string[] = [];
        this.selected.forEach(e => data.push(e.productCode));
        this.onPicked.emit(data);
        this.isOpen = false;
    }

    buildFilter(items: Product[]) {
        this.translate.get('All').subscribe((res: string) => {
            this.brands = [];
            this.brands.push({label: res, value: null});
            const filterBrands = Helpers.distinct(items.map((item: Product) => Helpers.newSelectItem(item.brand.brandName)));
            this.brands = this.brands.concat(filterBrands);

            this.categories = [];
            this.categories.push({label: res, value: null});
            const array = items.map((p: Product) => p.categories.map((c: ProductCategory) => c.category.categoryName)).join(',');
            const filterCategories = Helpers.distinct(array.split(',').map((item: string) => Helpers.newSelectItem(item)));
            this.categories = this.categories.concat(filterCategories);
        });
    }
}

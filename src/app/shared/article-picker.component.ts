import { Component, OnInit, EventEmitter, ViewChild, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DataTable, SelectItem, MenuItem } from 'primeng/primeng';
import { MessageService } from 'primeng/components/common/messageservice';
import { Product, ProductCategory, ProductAttributeValue, ArticleForm, ArticleItem } from './models';
import { Helpers } from './helpers';
import { ProductService } from './../services/product.service';

@Component({
    selector: 'article-picker',
    templateUrl: 'article-picker.component.html'
})

export class ArticlePickerComponent implements OnInit {
    @Output() onPicked = new EventEmitter();
    @ViewChild('dt') datatable: DataTable;
    totalRecords = 0;
    selected: Product;
    categories: SelectItem[];
    allbrands: SelectItem[];
    brands: SelectItem[];
    categoryValue: string;
    sliderValue: number;
    articleForm: ArticleForm;

    constructor(
        private messageService: MessageService,
        private translate: TranslateService,
        private productService: ProductService) {
    }

    set products(value) { this.productService.products = value; }
    get products(): Product[] { return this.productService.products; }

    ngOnInit() {
        if (!this.products) {
            this.reloadData();
        } else {
            this.refreshControl();
        }
    }

    private reloadData() {
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

    pickerClick() {
        const data: string[] = [];
        this.articleForm.body
            .forEach(p => p.forEach(e => {
                if (e.data > 0) {
                    data.push(`${e.value}#${e.data}`);
                }
            }));
        this.onPicked.emit(data);
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

    onRowSelect(event: any) {
        this.datatable.toggleRow(event.data);
    }

    onRowExpand(expandedItem: any) {
        this.getArticles(expandedItem.data.productId);
    }

    getArticles(productId: number) {
        this.articleForm = null;
        // from server
        this.productService.getStock(productId, '0', 0)
            .subscribe(result => {
                this.articleForm = result;
            }, onerror => this.messageService.add({severity: 'error', summary: '', detail: onerror._body}));
        /*
        // or from client
        this.header = [];
        this.articles = [];
        let productAttributeValues: ProductAttributeValue[] = [];

        let lenght = this.selected.attributes.length - 1;
        if (lenght > 0) {
            this.selected.attributes.forEach(elem => {
                this.header.push(elem.attribute.attributeName);
                productAttributeValues = productAttributeValues.concat(elem.attributeValues);
            });
            this.header.pop();

            this.selected.attributes[lenght].attributeValues.forEach(elem => {
                this.header.push(elem.attributeValue.attributeValueName);
            });
        }

        let source = Observable.from(this.selected.articles)
            .groupBy(
                function (x) {
                    return x.attributeValues
                        .map(p => p.attributeValueId)
                        .slice(0, x.attributeValues.length - 1)
                        .join('#');
                },
                function (x) { return x; }
            );

        source.subscribe(obs => {
            let row: any[] = [];
            let isFirst = true;
            obs.forEach(e => {
                let qta = `${e.quantity}#${e.barcode}`;
                if (isFirst) {
                    e.attributeValues.forEach(ex => {
                        let productAttributeValue = productAttributeValues.find(
                            p => p.attributeValue.attributeValueId === ex.attributeValueId
                        );
                        row.push(productAttributeValue.attributeValue.attributeValueName);
                    });
                    isFirst = false;
                    row[row.length - 1] = qta;
                } else {
                    row.push(qta);
                }
            }).then(p => {
                this.articles.push(row);
            });
        });
        */
    }
}

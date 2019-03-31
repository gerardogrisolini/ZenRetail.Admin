import { Component, OnInit, OnDestroy, ViewContainerRef, ViewChild, ComponentFactoryResolver } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { ConfirmationService, SelectItem } from 'primeng/primeng';
import { MessageService } from 'primeng/components/common/messageservice';
import { Product, Brand, ProductCategory, Category, Barcode, Article, Publication } from './../shared/models';
import { Helpers } from './../shared/helpers';
import { SessionService } from './../services/session.service';
import { BrandService } from './../services/brand.service';
import { CategoryService } from './../services/category.service';
import { ProductService } from './../services/product.service';
import { BrandComponent } from '../brand/brand.component';
import { CategoryComponent } from '../category/category.component';
import { AttributesComponent } from '../attribute/attributes.component';
import { DetailComponent } from './detail.component';
import { ArticlePickerComponent } from '../shared/article-picker.component';
import { PublicationService } from '../services/publication.service';

@Component({
    selector: 'app-product',
    templateUrl: 'product.component.html'
})

export class ProductComponent implements OnInit, OnDestroy {
    public static instance: ProductComponent = null;
    public helpers = Helpers;

    @ViewChild('dynamicComponentContainer', { read: ViewContainerRef }) divContainer;
    private sub: any;
    isBusy: boolean;
    dataform: FormGroup;
    types: SelectItem[];
    taxes: SelectItem[];
    ums: SelectItem[];
    packagings: SelectItem[];
    brands: Brand[];
    brandsFiltered: Brand[];
    categories: Category[];
    categoriesFiltered: Category[];
    categoriesSelected: Category[];
    visibleSidebar: boolean;

    constructor(private activatedRoute: ActivatedRoute,
                private messageService: MessageService,
                private translate: TranslateService,
                public sessionService: SessionService,
                private productService: ProductService,
                private brandService: BrandService,
                private categoryService: CategoryService,
                private publicationService: PublicationService,
                private componentFactoryResolver: ComponentFactoryResolver,
                private confirmationService: ConfirmationService,
                private fb: FormBuilder,
                private location: Location) {
        ProductComponent.instance = this;
    }

    ngOnInit() {
        this.sessionService.checkCredentials(false);
        this.sessionService.setTitle('Product');

        this.dataform = this.fb.group({
            'code': new FormControl('', Validators.required),
            'name': new FormControl('', Validators.required),
            'country': new FormControl('', Validators.nullValidator),
            'description': new FormControl('', Validators.nullValidator),
            'brand': new FormControl('', Validators.required),
            'categories': new FormControl('', Validators.nullValidator),
            'um': new FormControl('', Validators.required),
            'tax': new FormControl('', Validators.required),
            'selling': new FormControl('', Validators.required),
            'purchase': new FormControl('', Validators.required),
            'weight': new FormControl('', Validators.required),
            'length': new FormControl('', Validators.required),
            'width': new FormControl('', Validators.required),
            'height': new FormControl('', Validators.required),
            'isActive': new FormControl('', Validators.required)
        });

        this.sub = this.activatedRoute.params.subscribe(params => {
            const productId = Number(params['id']);
            this.ums = Helpers.getUnitOfMeasure();
            this.ums.forEach(p => {
                this.translate.get(p.label).subscribe((res: string) => p.label = res);
            });
            this.productService.getTaxes()
                .subscribe(taxes => {
                    this.taxes = taxes.map(p => Helpers.newSelectItem(p, p.name));
                    this.taxes.forEach(p => {
                        this.translate.get(p.label).subscribe((res: string) => p.label = res);
                    });
                    this.productService.getTypes()
                        .subscribe(types => {
                            if (productId === 0) {
                                this.types = types.map(p => Helpers.newSelectItem(p.value));
                                this.addClick();
                            } else {
                                this.productService.getProduct(productId)
                                    .subscribe(
                                        result => {
                                            this.productService.product = result;
                                            this.categoriesSelected = result.categories.map(p => p.category);
                                            // const article = this.productService.product
                                            //                     .articles.find(p => p.attributeValues.length === 0);
                                            // if (article) {
                                            //    this.barcode = article.barcodes.find(p => p.tags.length === 0).barcode;
                                            // }
                                            this.getPublication();
                                        },
                                        onerror => this.messageService.add({
                                            severity: 'error', summary: '', detail: onerror._body
                                        })
                                    );
                            }
                            this.getBrands();
                            this.getCategories();
                        });
                });
        });
    }

    ngOnDestroy() {
        // Clean sub to avoid memory leak
        this.sub.unsubscribe();
        this.productService.product = null;
    }

    get selected(): Product { return this.productService.product; }
    get isNew(): boolean { return this.selected == null || this.selected.productId === 0; }
    get selectedIndex(): number { return this.productService.products.indexOf(this.selected); }
    set publication(value) { this.publicationService.publication = value; }
    get publication(): Publication { return this.publicationService.publication; }

    getBrands() {
        this.brandService.getAll()
            .subscribe(result => {
                this.brands = result;
            });
    }

    getCategories() {
        this.categoryService.getAll()
            .subscribe(result => {
                this.categories = result;
            });
    }

    getPublication() {
        this.publicationService.getByProductId(this.selected.productId)
            .subscribe(
                result => {
                    // result.productId = this.selected.productId;
                    this.publication = result;
                }, onerror => this.publication = new Publication(0)
            );
    }

    addClick() {
        this.productService.product = new Product();
        this.selected.productTax = this.taxes[0].value;
        this.selected.productUm = this.ums[0].value;
        this.publication = new Publication(0);
    }

    closeClick() {
        this.location.back();
    }

    openSidebarClick($event): any {
        this.sessionService.titleSidebar = $event;
        this.divContainer.clear();
        let component: any;
        switch ($event) {
            case 'Brands':
                component = BrandComponent
                break;
            case 'Categories':
                component = CategoryComponent
                break;
            case 'Attributes':
                component = AttributesComponent
                break;
            case 'Articles':
                component = ArticlePickerComponent
                break;
            default:
                component = DetailComponent
                break;
        }
        const factory = this.componentFactoryResolver.resolveComponentFactory(component);
        return this.divContainer.createComponent(factory);
    }

    closeSidebarClick(event) {
        switch (this.sessionService.titleSidebar) {
            case 'Brands':
                this.getBrands();
                break;
            case 'Categories':
                this.getCategories();
                break;
        }
        this.sessionService.titleSidebar = '';
    }

    saveClick() {
        this.isBusy = true;
        this.selected.categories = [];
        this.categoriesSelected.forEach(c => {
            const productCategory = <ProductCategory>{
                productId: this.selected.productId,
                category: c
            };
            this.selected.categories.push(productCategory);
        });

        if (this.isNew) {
            this.productService.create(this.selected)
                .subscribe(result => {
                    this.productService.product = result;
                    this.translate.get('Product created!').subscribe((res: string) =>
                        this.messageService.add({severity: 'success', summary: '', detail: res}));
                    this.makeArticles(false);
                    if (this.publication.publicationStartAt) {
                        this.createPublication();
                    }
                    this.isBusy = false;
                }, onerror => this.messageService.add({severity: 'error', summary: '', detail: onerror._body}));
        } else {
            this.productService.update(this.selected.productId, this.selected)
                .subscribe(result => {
                    this.productService.product = result;
                    this.translate.get('Product updated!').subscribe((res: string) =>
                        this.messageService.add({severity: 'success', summary: '', detail: res}));
                    this.makeArticles(false);
                    if (this.publication.publicationId > 0) {
                        this.publicationService.update()
                            .subscribe(res => {
                                this.publication = res;
                                this.translate.get('Publication updated!').subscribe((resp: string) =>
                                    this.messageService.add({severity: 'success', summary: '', detail: resp}));
                            });
                    } else {
                        this.createPublication();
                    }
                    this.isBusy = false;
                }, onerror => this.messageService.add({severity: 'error', summary: '', detail: onerror._body}));
        }
    }

    makeArticles(isNew: Boolean) {
        this.productService.build(this.selected.productId)
            .subscribe(res => {
                this.selected.articles = res.articles;
                if (this.productService.products) {
                    if (isNew) {
                        this.productService.products.push(this.selected);
                    } else {
                        this.productService.products[this.selectedIndex] = this.selected;
                    }
                }
                let message = '';
                this.translate.get('Added').subscribe((resp: string) => message += resp);
                message += ': ' + res.added;
                this.translate.get('Updated').subscribe((resp: string) => message += '<br/>' + resp);
                message += ': ' + res.updated;
                this.translate.get('Deleted').subscribe((resp: string) => message += '<br/>' + resp);
                message += ': ' + res.deleted;
                this.translate.get('Articles saved!').subscribe((resp: string) =>
                    this.messageService.add({severity: 'success', summary: resp, detail: message}));
            });
    }

    createPublication() {
        this.publicationService.create(this.selected.productId)
            .subscribe(res => {
                this.publication = res;
                this.translate.get('Publication created!').subscribe((resp: string) =>
                    this.messageService.add({severity: 'success', summary: '', detail: resp}));
            });
    }

    resetClick() {
        this.translate
            .get('All information related to this product will be send to Amazon. Are you sure that you want to reset this product?')
            .subscribe((res: string) =>
                this.confirmationService.confirm({
                    message: res,
                    accept: () => {
                        this.productService.resetAmazon(this.selected.productId)
                            .subscribe(result => {
                                this.messageService.add({severity: 'success', summary: '', detail: 'Reset successfully registered!'})
                            }, onerror => this.messageService.add({severity: 'error', summary: '', detail: onerror._body}));
                    }
                })
        );
    }

    deleteClick() {
        this.translate
            .get('All information related to this product will be deleted. Are you sure that you want to delete this product?')
            .subscribe((res: string) =>
                this.confirmationService.confirm({
                    message: res,
                    accept: () => {
                        this.productService.delete(this.selected.productId)
                            .subscribe(result => {
                                this.productService.products.splice(this.selectedIndex, 1);
                                this.closeClick();
                            }, onerror => this.messageService.add({severity: 'error', summary: '', detail: onerror._body}));
                    }
                })
        );
    }

    filterBrands(event) {
        this.brandsFiltered = [];
        this.brands.forEach(p => {
            if (event.query === ' ' || p.brandName.toLowerCase().indexOf(event.query.toLowerCase()) === 0) {
                this.brandsFiltered.push(p);
            }
        });
        if (this.brandsFiltered.length === 0) {
            const brand = new Brand();
            brand.brandName = event.query;
            this.brandsFiltered.push(brand);
        }
    }

    filterCategories(event) {
        this.categoriesFiltered = [];
        this.categories.forEach(p => {
            if (event.query === ' ' || p.categoryName.toLowerCase().indexOf(event.query.toLowerCase()) === 0) {
                this.categoriesFiltered.push(p);
            }
        });
        if (this.categoriesFiltered.length === 0) {
            const category = new Category(0, event.query);
            this.categoriesFiltered.push(category);
        }
    }
}

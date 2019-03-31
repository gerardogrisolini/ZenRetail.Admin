import { Component, OnInit  } from '@angular/core';
import { SessionService } from './../services/session.service';
import { SelectItem } from 'primeng/primeng';
import { MessageService } from 'primeng/components/common/messageservice';
import { ImportService, CodartInfo, Translate, Image } from './../services/import.service';
import {
    Product, Brand, Category, ProductCategory, Price, Tax,
    Attribute, AttributeValue, ProductAttribute, ProductAttributeValue,
    Article, ArticleAttributeValue, Media, Translation, Barcode, Packaging, Discount, Seo
} from './../shared/models';
import { Helpers } from '../shared/helpers';

@Component({
    selector: 'app-import-component',
    templateUrl: 'import.component.html'
})

export class ImportComponent implements OnInit  {

    isBusy: boolean;
    productCode: String;
    product: Product;
    products: SelectItem[];

    constructor(private messageService: MessageService,
                private sessionService: SessionService,
                private importService: ImportService) {
    }

    ngOnInit() {
        this.sessionService.checkCredentials(true);
        this.sessionService.setTitle('Import');
        this.getProducts();
     }

     getProducts() {
        this.isBusy = true;
        this.importService.getProducts()
        .subscribe(res => {
            this.products = res.map(p => Helpers.newSelectItem(p.id, `${p.id} : ${p.key}`));
            this.isBusy = false;
        }, onerror => this.showError(onerror._body));
     }

     importClick() {
        this.isBusy = true;
        this.importService.getProductById(this.productCode)
        .subscribe(res => {
            this.product = this.convertProduct(res);
            this.importService.create(this.product)
            .subscribe(result => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'import',
                    detail: 'Totals: added ' + result.added + ' updated ' + result.updated + ' deleted ' + result.deleted
                });
                this.isBusy = false;
            }, onerror => this.showError(onerror._body));
        }, onerror => this.showError(onerror._body));
    }

    showError(error: any) {
        this.messageService.add({severity: 'error', summary: 'import', detail: error});
        this.isBusy = false;
    }

    convertProduct(product: CodartInfo): Product {
        // Brand
        const brand = new Brand();
        brand.brandName = 'Tessilnova';

        // Categories
        const category = new Category(0, product.category.desc);
        category.categoryIsPrimary = true;
        category.translations = product.category.translates.map(p => new Translation(p.code, p.value));

        const subcategory = new Category(0, product.subcategory.desc);
        subcategory.categoryIsPrimary = false;
        subcategory.translations = product.subcategory.translates.map(p => new Translation(p.code, p.value));

        // Texture
        const texture = product.producer.desc.replace('Tessilnova ', '');
        const textureAttribute = <ProductAttribute>{
            attribute: new Attribute(0, 'Texture', [new Translation('IT', 'Tessuto')]),
            attributeValues: [
                <ProductAttributeValue>{ attributeValue: new AttributeValue(0, 0, product.producer.id.trim(), texture, []) }
            ]
        };

        // Colors
        const colors = Helpers.distinct(product.codarts.map(p => Helpers.newSelectItem(p.colorId.trim(), p.color)));
        const colorAttribute = <ProductAttribute>{
            attribute: new Attribute(0, 'Color', [new Translation('IT', 'Colore')]),
            attributeValues: colors.map(p => <ProductAttributeValue>{
                attributeValue: new AttributeValue(0, 0, p.value, p.label,
                    product.translates.filter(t => t.key === p.label).map(t => new Translation(t.code, t.value))
                )
            })
        };

        // Sizes
        const sizes = product.codarts.map(p => p.size).filter((x, i, a) => x && a.indexOf(x) === i);
        const sizeAttribute = <ProductAttribute>{
            attribute: new Attribute(0, 'Size', [new Translation('IT', 'Misura')]),
            attributeValues: sizes.map(p => <ProductAttributeValue>{ attributeValue: new AttributeValue(0, 0, p, p,
                product.translates.filter(t => t.key === p).map(t => new Translation(t.code, t.value))
            ) })
        };

        // Articles
        const articles: Article[] = [];
        const defaultArticle = new Article();
        defaultArticle.barcodes = [<Barcode>{ barcode: product.id, tags: [], price: new Price(), discount: new Discount() }];
        defaultArticle.packaging = new Packaging();
        defaultArticle.attributeValues = [];
        articles.push(defaultArticle);
        product.codarts.forEach(p => {
            const article = new Article();
            article.barcodes = [<Barcode>{ barcode: p.barcode, tags: [], price: new Price(), discount: new Discount() }];
            article.packaging = new Packaging();
            article.attributeValues = [
                <ArticleAttributeValue>{ attributeValue: new AttributeValue(0, 0, product.producer.id.trim(), texture, []) },
                <ArticleAttributeValue>{ attributeValue: new AttributeValue(0, 0, p.colorId.trim(), p.color, []) },
                <ArticleAttributeValue>{ attributeValue: new AttributeValue(0, 0, p.size, p.size, []) }
            ];
            articles.push(article);
        });

        // Medias
        const base = 'https://www.tessilnova.com:443/Media/';
        const medias = product.medias.map(p => new Media(base + p.filename, 'image/png'));

        // Translations
        const translations = product
            .translates.filter(p => p.key === product.id)
            .map(p => new Translation(p.code, p.value));

        // Product
        const item = new Product();
        item.productCode = product.id;
        item.productName = product.name;
        item.productUm = 'QT';
        item.productTax = new Tax('Standard rate', 22);
        const price = new Price();
        price.selling = product.price;
        item.price = price;
        item.discount = new Discount();
        item.packaging = new Packaging();
        item.seo = new Seo();
        item.brand = brand;
        item.categories = [
            <ProductCategory>{ productId: 0, category: category },
            <ProductCategory>{ productId: 0, category: subcategory }
        ];
        item.attributes = [ textureAttribute, colorAttribute, sizeAttribute ];
        item.articles = articles;
        item.medias = medias;
        item.translations = product.translates.filter(p => p.key === product.id).map(p => new Translation(p.code, p.value));

        return item;
    }
}

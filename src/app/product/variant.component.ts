import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { ConfirmationService, TreeNode, Message, SelectItem } from 'primeng/api';
import {
    Product, Attribute, AttributeValue, AttributeForm,
    ProductAttribute, ProductAttributeValue, ArticleForm, Article, Packaging, Barcode, Tag
} from './../shared/models';
import { ProductService } from './../services/product.service';
import { AttributeService } from './../services/attribute.service';
import { ProductComponent } from './product.component';
import { Helpers } from '../shared/helpers';

@Component({
    selector: 'app-variant',
    templateUrl: 'variant.component.html'
})

export class VariantComponent implements OnInit {
    forms: AttributeForm[];
    formsSelected: AttributeForm[];
    filteredNames: string[];
    productInfo: TreeNode[];
    selectedNode: TreeNode;
    articleForm: ArticleForm;
    tags: SelectItem[];
    selectedTag: number;

    constructor(private messageService: MessageService,
        private translate: TranslateService,
        private confirmationService: ConfirmationService,
        private productService: ProductService,
        private attributeService: AttributeService) {
    }

    get product(): Product { return this.productService.product; }
    get totalRecords(): number { return this.productService.product.articles.length; }

    ngOnInit() {
        this.forms = [];
        this.formsSelected = [];
 
        this.product.attributes.forEach(p => {
            const values = p.attributeValues.map(v => v.attributeValue.attributeValueName);
            this.formsSelected.push(<AttributeForm>{ id: p.attribute.attributeId, name: p.attribute.attributeName, values: values });
        });

        if (this.formsSelected.length === 0) {
            this.addClick();
        }

        this.attributeService.getValueAll()
            .subscribe(data => {
                this.attributeService.getAll()
                .subscribe(result => {
                    result.forEach(p => {
                        const values = data.filter(v => v.attributeId === p.attributeId).map(v => v.attributeValueName);
                        this.forms.push(<AttributeForm>{ id: p.attributeId, name: p.attributeName, values: values });
                    });
                    this.createTree();
                }, onerror => this.messageService.add({severity: 'error', summary: '', detail: onerror._body}));
            }, onerror => this.messageService.add({severity: 'error', summary: '', detail: onerror._body}));

        this.createSheet();
    }

    createTree() {
        this.translate.get('Attributes').subscribe((res: string) => {
            const attributesNode = Helpers.newNode(res, '[]', 'attributes');
            this.product.attributes.forEach(elem => {
                const node = Helpers.newNode(
                    elem.attribute.attributeName, elem.attribute.attributeId.toString(),
                    `attribute:${elem.productAttributeId}`
                );
                elem.attributeValues.forEach(e =>
                    node.children.push(Helpers.newNode(
                        e.attributeValue.attributeValueName,
                        e.attributeValue.attributeValueId.toString(),
                        'attributeValue')
                    )
                );
                node.expanded = false; // node.children.length > 0;
                attributesNode.children.push(node);
            });
            attributesNode.expanded = attributesNode.children.length > 0;
            this.productInfo = [attributesNode];
        });
    }

    updateAttributes(event) {
        this.product.attributes.length = 0;
        this.formsSelected.forEach(p => {
            const values = p.values.map(v =>
                <ProductAttributeValue> {
                    attributeValue: new AttributeValue(0, v, v)
                }
            );
            const attribute = new Attribute(0, p.name);
            const productAttribute = <ProductAttribute>{
                attribute: attribute,
                attributeValues: values
            };
            this.product.attributes.push(productAttribute);
        });

        console.log(this.product.attributes);
    }

    filterAttributes(event) {
        this.filteredNames = [];
        this.forms.forEach(p => {
            if (event.query === ' ' || p.name.toLowerCase().indexOf(event.query.toLowerCase()) === 0) {
                this.filteredNames.push(p.name);
            }
        });
        this.addValue(event.query);
    }

    filterAttributeValues(event, id) {
        this.filteredNames = [];
        this.forms.filter(p => id === 0 || p.id === id)
            .forEach(v => {
                v.values.forEach(x => {
                    if (event.query === ' ' || x.toLowerCase().indexOf(event.query.toLowerCase()) === 0) {
                        this.filteredNames.push(x);
                    }
                });
            });
        this.addValue(event.query);
    }

    addValue(value) {
        if (this.filteredNames.length === 0) {
            this.filteredNames.push(value);
        }
    }

    addClick() {
        this.formsSelected.push(<AttributeForm>{ id: 0, name: '', values: [] });
    }

    removeClick(name) {
        this.translate.get('Are you sure that you want to remove this attribute?').subscribe((res: string) =>
            this.confirmationService.confirm({
                message: res,
                accept: () => {
                    const index = this.formsSelected.findIndex(p => p.name === name);
                    this.formsSelected.splice(index, 1);
                    this.updateAttributes(this);
                }
            })
        );
    }

    openAttributesClick() {
        this.translate.get('Attributes').subscribe((res: string) =>
            ProductComponent.instance.openSidebarClick(res));
    }

    nodeSelect(event) {
        if (this.selectedNode.children.length === 0) {
            this.translate.get('Changes for:').subscribe((res: string) =>
                ProductComponent.instance.openSidebarClick(res + ' ' + this.selectedNode.label));
        }
    }

    createSheet() {
        this.selectedTag = -1;
        this.tags = [];
        this.translate.get('Select tag...').subscribe((res: string) =>
            this.tags.push(Helpers.newSelectItem(-1, res)));
        this.translate.get('Default').subscribe((res: string) =>
            this.tags.push(Helpers.newSelectItem(0, res)));
        this.product.articles.forEach(article => {
            article.barcodes.forEach(barcode => {
                barcode.tags.forEach(tag => {
                    if (this.tags.findIndex(i => i.value === tag.valueId) < 0) {
                        this.tags.push(Helpers.newSelectItem(tag.valueId, tag.valueName));
                    }
                });
            });
        });
    }

    tagChanged(event) {
        if (this.selectedTag < 0) {
            this.articleForm.header.length = 0;
            this.articleForm.body.length = 0;
            return;
        }
        this.productService.getStock(this.product.productId, '0', this.selectedTag)
            .subscribe(result => {
                this.articleForm = result;
            }, onerror => this.messageService.add({severity: 'error', summary: '', detail: onerror._body}));
    }

    saveClick() {
        let count = 0;
        const length = this.articleForm.body.length - 1;
        this.articleForm.body
            .forEach(pp => {
                pp.forEach(p => {
                    if (p.id > 0) {
                        const array: Tag[] = [];
                        if (this.selectedTag !== 0) {
                            array.push(<Tag>{ valueId: this.selectedTag, valueName: '', groupId: 0, groupName: '' });
                        }
                        const article = new Article();
                        article.articleId = p.id;
                        article.barcodes = [<Barcode>{ barcode: p.value, tags: array }];
                        this.productService
                            .updateArticle(p.id, article)
                            .subscribe(result => {
                                count++;
                                this.messageService.add({
                                    severity: 'success',
                                    detail: count + ') ' + p.value
                                });
                            }, onerror => this.messageService.add({severity: 'error', summary: '', detail: onerror._body}));
                    }
                });
            });
    }
}

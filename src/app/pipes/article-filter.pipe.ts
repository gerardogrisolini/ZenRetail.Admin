import { Pipe, PipeTransform } from '@angular/core';
import { Product } from './../shared/models';

@Pipe({
  name: 'articleFilter'
})
export class ArticleFilterPipe implements PipeTransform {
  transform(value: any[], args?: string): any {
    if (!value) { return; }
    if (!args) { return value; }

    const search = args.toLowerCase();
    return value.filter(item => this.contain(item.movementArticleProduct, search));
  }

  contain(item: Product, value: string): boolean {
    let info = item.productName.toLowerCase();
    const ids = item.articles[0].attributeValues.map(p => p.attributeValueId);

    item.attributes.map(p => p.attributeValues.forEach(b => {
        if (ids.indexOf(b.attributeValue.attributeValueId) > -1) {
          info += ` ${b.attributeValue.attributeValueName.toLowerCase()}`;
        }
    }));
    return info.includes(value);
  }
}

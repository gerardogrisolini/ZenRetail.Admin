import { Pipe, PipeTransform } from '@angular/core';
import { Product } from './../shared/models';

@Pipe({
  name: 'articleInfo'
})
export class ArticleInfoPipe implements PipeTransform {
  transform(value: Product, args0?: string, args1?: boolean): string {
    if (value == null || value.productId === 0) {
      return '';
    }
    if (args0 == null) {
      return value.productName;
    }
    const barcode = args0;
    let info = args1 ? '' : value.productName;
    const ids = value.articles
        .find(p => p.barcodes.find(z => z.barcode === barcode) != null)
        .attributeValues.map(p => p.attributeValueId);

    value.attributes.map(p => p.attributeValues.forEach(b => {
        if (ids.indexOf(b.attributeValue.attributeValueId) > -1 && b.attributeValue.attributeValueName !== 'None') {
          info += ` ${b.attributeValue.attributeValueName}`;
        }
    }));

    return info;
    }
  }

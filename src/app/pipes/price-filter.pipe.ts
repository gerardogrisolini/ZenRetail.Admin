import { Pipe, PipeTransform } from '@angular/core';
import { Product, Invoice, Movement, MovementArticle } from '../shared/models';

@Pipe({
  name: 'priceFilter'
})

export class PriceFilterPipe implements PipeTransform {
  transform(value: any[], args0?: any, args1?: any, args2?: any): any {

    if (!value) {
      return;
    }
    if (args0 == null) {
      return value;
    }

    const type = args1;
    const maxValue = args0;
    switch (type) {
      // case 'discounts':
      //   return value.filter(data => (data.discountPercentage > 0 ? data.discountPercentage : data.discountPrice) <= maxValue);
      // case 'discount':
      //   const item = args2;
      //   return value.filter(data => (item.discountPercentage === 0
      //     ? ((data.discountProduct.productSellingPrice - item.discountPrice) / data.discountProduct.productSellingPrice * 100.0)
      //     : data.discountProduct.productSellingPrice - (data.discountProduct.productSellingPrice * item.discountPercentage / 100)
      //   ) <= maxValue);
      case 'movements':
        return value.filter((data: Movement) => data.movementAmount <= maxValue);
      case 'movement':
        if (args2 == null) {
          return value.filter((data: MovementArticle) => data.movementArticlePrice <= maxValue);
        }
        const maxAmount = args2;
        if (args0 == null) {
          return value.filter((data: MovementArticle) => data.movementArticleAmount <= maxAmount);
        }
        return value.filter(data => data.movementArticlePrice <= maxValue && data.movementArticleAmount <= maxAmount);
      case 'invoices':
        return value.filter((data: Invoice) => data.invoiceAmount <= maxValue);
      default:
        return value.filter((data: Product) => (data.discount.isValid ? data.discount.price : data.price.selling) <= maxValue);
    }
  }
}

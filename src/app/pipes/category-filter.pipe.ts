import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'categoryFilter'
})
export class CategoryFilterPipe implements PipeTransform {
  transform(value: any[], args0?: any, args1?: any): any {
    if (!value) { return; }
    if (!args0) { return value; }

    const category = args0;
    if (args1 != null) {
      return value.filter(item => this.contain(item.movementArticleProduct.categories, category));
    }
    return value.filter(item => this.contain(item.categories, category));
  }

  contain(items: any[], value: string): boolean {
    if (!value) { return true; }
    for (let i = 0; i < items.length; i++) {
        if (items[i].category.categoryName.indexOf(value) >= 0) {
            return true;
        }
    }
    return false;
  }
}

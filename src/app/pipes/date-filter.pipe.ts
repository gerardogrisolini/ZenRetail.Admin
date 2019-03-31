import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFilter'
})

export class DateFilterPipe implements PipeTransform {
  transform(value: any[], arg0?: Date, arg1?: Date): any {

    if (!value) {
      return;
    }

    if (arg0 == null) {
      return value;
    }

    const dateStart = arg0;
    const dateFinish = arg1;

    if (arg1 != null) {
      return value.filter(item => this.getDate(item) >= dateStart && this.getDate(item) <= dateFinish);
    }

    return value.filter(item => this.getDate(item).toDateString() === dateStart.toDateString());
  }

  getDate(item: any): Date {
    return new Date(item.movementDate ? item.movementDate.substring(0, 10) : item.invoiceDate.substring(0, 10));
  }
}

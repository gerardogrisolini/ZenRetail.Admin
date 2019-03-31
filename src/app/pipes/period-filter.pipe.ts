import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'periodFilter'
})

export class PeriodFilterPipe implements PipeTransform {
  transform(value: any[], arg0?: Date, arg1?: Date): any {

    if (!value) {
      return;
    }

    if (arg0 == null && arg1 == null) {
      return value;
    }

    const dateStart = arg0;
    const dateFinish = arg1;

    if (arg0 != null && arg1 == null) {
      return value.filter(item => new Date(item.startAt).toISOString() === dateStart.toISOString());
    }

    if (arg0 == null && arg1 != null) {
      return value.filter(item => new Date(item.finishAt).toISOString() === dateFinish.toISOString());
    }

    return value.filter(item => new Date(item.startAt) >= dateStart && new Date(item.finishAt) <= dateFinish);
  }
}

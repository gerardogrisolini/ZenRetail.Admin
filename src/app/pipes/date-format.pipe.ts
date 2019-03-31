import { Pipe, PipeTransform, Inject, LOCALE_ID } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Helpers } from '../shared/helpers';

@Pipe({
  name: 'dateFormat'
})
export class DateFormatPipe implements PipeTransform {
  constructor(@Inject(LOCALE_ID) private _locale: string) {
  }

  transform(value: number, args0?: string): string {
    const timeReferenceDate = new Date('2001-01-01').getTime();
    const timeIntervalSinceReferenceDate = value * 1000;
    const format = args0 != null ? args0 : 'yyyy-MM-dd HH:mm:ss';
    const datePipe = new DatePipe(this._locale)
    return datePipe.transform(timeReferenceDate + timeIntervalSinceReferenceDate, format, Helpers.utc);
  }
}

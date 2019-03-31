import { Pipe, PipeTransform, Inject, LOCALE_ID } from '@angular/core';
import { Helpers } from '../shared/helpers';
import { CurrencyPipe } from '@angular/common';

@Pipe({
  name: 'currencyFormat'
})
export class CurrencyFormatPipe implements PipeTransform {
  constructor(@Inject(LOCALE_ID) private _locale: string) {
  }

  transform(value: number, args0?: string): string {
    const currencyPipe = new CurrencyPipe(this._locale);
    return currencyPipe.transform(value, Helpers.currency, 'symbol');
  }
}

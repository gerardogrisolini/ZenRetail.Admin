import { Component, OnInit, Input, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Translation } from './../shared/models';
import { SelectItem } from 'primeng/api';
import { Helpers } from './helpers';

@Component({
    selector: 'app-translation',
    templateUrl: 'translation.component.html'
})

export class TranslationComponent implements OnInit {
    @Output() @Input() translations: Translation[];
    @Input() style: string;
    countries: SelectItem[] = [];
    country: string;
    translation: Translation;

    constructor(private translate: TranslateService) { }

    ngOnInit() {
        this.countries.push(Helpers.newSelectItem(''))
        Helpers.locales.forEach(p => {
            this.translate.get(p.label).subscribe((res: string) => p.label = res);
            this.countries.push(p)
        });
        this.country = this.countries[0].value;
        this.onCountryChanged(null);
    }

    onCountryChanged(event) {
        if (!this.translations) {
            this.translations = [];
        }
        const item = this.translations.find(p => p.country === this.country);
        if (item) {
            this.translation = item;
        } else if (this.country !== '') {
            this.translation = new Translation(this.country, '');
            this.translations.push(this.translation);
        }
    }
}

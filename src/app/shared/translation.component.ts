import { Component, OnInit, Input, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Translation } from './../shared/models';
import { SelectItem } from 'primeng/primeng';
import { Helpers } from './helpers';

@Component({
    selector: 'app-translation',
    templateUrl: 'translation.component.html'
})

export class TranslationComponent implements OnInit {
    @Output() @Input() translations: Translation[];
    countries: SelectItem[];
    country: string;
    translation: Translation;

    constructor(private translate: TranslateService) { }

    ngOnInit() {
        this.countries = Helpers.locales;
        this.countries.forEach(p => {
            this.translate.get(p.label).subscribe((res: string) => p.label = res);
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
        } else {
            this.translation = new Translation(this.country, '');
            this.translations.push(this.translation);
        }
    }
}

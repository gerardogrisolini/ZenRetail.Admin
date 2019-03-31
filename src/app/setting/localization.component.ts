import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { MessageService } from 'primeng/components/common/messageservice';
import { SelectItem } from 'primeng/primeng';
import { CountryService, Country } from '../services/country.service';
import { SessionService } from '../services/session.service';
import { CompanyService } from '../services/company.service';
import { Company, Translation } from '../shared/models';
import { Helpers } from '../shared/helpers';
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'app-localization-component',
    templateUrl: 'localization.component.html'
})

export class LocalizationComponent implements OnInit {
    company: Company;
    dataform: FormGroup;
    countries: SelectItem[];
    currencies: SelectItem[];
    timezones: SelectItem[];
    translation: Translation;

    constructor(
        private sessionService: SessionService,
        private translate: TranslateService,
        private messageService: MessageService,
        private countryService: CountryService,
        private companyService: CompanyService,
        private fb: FormBuilder) {
        this.countries = [];
        this.currencies = [];
        this.timezones = [];
    }

    ngOnInit() {
        this.sessionService.checkCredentials(false);
        this.sessionService.setTitle('Localization');

        this.translation = new Translation('', '');
        this.dataform = this.fb.group({
            'currency': new FormControl('', [Validators.nullValidator, Validators.minLength(3), Validators.maxLength(3)]),
            'utc': new FormControl('', Validators.nullValidator),
            'localeCode': new FormControl('', [Validators.nullValidator, Validators.minLength(2), Validators.maxLength(2)]),
            'localeName': new FormControl('', Validators.nullValidator)
        });

        this.countryService.get()
            .subscribe(result => {
                this.loadCountries(result);
            }, onerror => this.messageService.add({severity: 'error', summary: '', detail: onerror._body})
        );
    }

    loadCountries(countries: Country[]) {
        this.countries = countries.map(p => Helpers.newSelectItem(p.alpha3Code, p.alpha3Code + ' - ' + p.name));

        let current: Country;
        const names: string[] = [];
        countries.sort((n1, n2) => {
            if (n1.currencies[0].code > n2.currencies[0].code) {
                return 1;
            }
            if (n1.currencies[0].code < n2.currencies[0].code) {
                return -1;
            }
            return 0;
        }).forEach(p => {
            if (names.length > 0 && current.currencies[0].code !== p.currencies[0].code) {
                const item = Helpers.newSelectItem(current.currencies[0].code, current.currencies[0].code + ' (' + names.join(',') + ')');
                this.currencies.push(item);
                names.length = 0;
            }
            current = p;
            names.push(p.name);
        });

        names.length = 0;
        countries.sort((n1, n2) => {
            if (n1.timezones[0] > n2.timezones[0]) {
                return 1;
            }
            if (n1.timezones[0] < n2.timezones[0]) {
                return -1;
            }
            return 0;
        }).forEach(p => {
            if (names.length > 0 && current.timezones[0] !== p.timezones[0]) {
                const item = Helpers.newSelectItem(current.timezones[0], current.timezones[0] + ' (' + names.join(',') + ')');
                this.timezones.push(item);
                names.length = 0;
            }
            current = p;
            names.push(p.name);
        });

        this.companyService.get()
            .subscribe(result => {
                this.company = result;
                Helpers.setInfos(result);
            }, onerror => this.messageService.add({severity: 'error', summary: '', detail: onerror._body})
        );
    }

    addClick() {
        this.company.companyLocales.push(this.translation);
        this.translation = new Translation('', '');
        this.dataform.reset();
    }

    removeClick(item: Translation) {
        const index = this.company.companyLocales.indexOf(item);
        this.company.companyLocales.splice(index, 1);
    }

    saveClick() {
        this.companyService
            .save(this.company)
            .subscribe(result => {
                this.company = result;
                Helpers.setInfos(result);
                this.translate.get('Localization saved!').subscribe((res: string) =>
                    this.messageService.add({severity: 'success', summary: '', detail: res}));
            }, onerror => this.messageService.add({severity: 'error', summary: '', detail: onerror._body}));
    }
}

import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { MessageService } from 'primeng/components/common/messageservice';
import { SelectItem } from 'primeng/primeng';
import { CountryService, Country } from '../services/country.service';
import { SessionService } from '../services/session.service';
import { CompanyService } from '../services/company.service';
import { Company } from '../shared/models';
import { Helpers } from '../shared/helpers';

@Component({
    selector: 'app-company-component',
    templateUrl: 'company.component.html'
})

export class CompanyComponent implements OnInit {
    company: Company;
    dataform: FormGroup;
    header: string;
    paypalEnvs: SelectItem[];
    countries: SelectItem[];
    emailTest: string;

    constructor(
        private sessionService: SessionService,
        private translate: TranslateService,
        private messageService: MessageService,
        private countryService: CountryService,
        private companyService: CompanyService,
        private fb: FormBuilder) {
        this.header = '/media/header.png';
        this.paypalEnvs = [
            {label: 'Sandbox', value: 'sandbox'},
            {label: 'Production', value: 'production'},
        ];
        this.countries = [];
    }

    ngOnInit() {
        this.sessionService.checkCredentials(false);
        this.sessionService.setTitle('Company');

        this.dataform = this.fb.group({
            'name': new FormControl('', Validators.nullValidator),
            'desc': new FormControl('', Validators.nullValidator),
            'site': new FormControl('', Validators.nullValidator),
            'address': new FormControl('', Validators.nullValidator),
            'city': new FormControl('', Validators.nullValidator),
            'zip': new FormControl('', [Validators.nullValidator, Validators.minLength(5), Validators.maxLength(5)]),
            'province': new FormControl('', [Validators.nullValidator, Validators.minLength(2), Validators.maxLength(2)]),
            'country': new FormControl('', [Validators.nullValidator, Validators.minLength(3), Validators.maxLength(3)]),
            'vatNumber': new FormControl('', [Validators.nullValidator, Validators.minLength(11), Validators.maxLength(11)]),

            'emailInfo': new FormControl('', Validators.nullValidator),
            'emailSales': new FormControl('', Validators.nullValidator),
            'emailSupport': new FormControl('', Validators.nullValidator),
            'phone': new FormControl('', Validators.nullValidator),

            'barcodePublic': new FormControl('', [Validators.required, Validators.minLength(12), Validators.maxLength(12)]),
            'barcodePrivate': new FormControl('', [Validators.required, Validators.minLength(12), Validators.maxLength(12)])
        });

        this.countryService.get()
            .subscribe(result => {
                this.loadCountries(result);
            }, onerror => this.messageService.add({severity: 'error', summary: '', detail: onerror._body})
        );
    }

    loadCountries(countries: Country[]) {
        this.countries = countries.map(p => Helpers.newSelectItem(p.alpha3Code, p.alpha3Code + ' - ' + p.name));

        this.companyService.get()
            .subscribe(result => {
                this.company = result;
                Helpers.setInfos(result);
            }, onerror => this.messageService.add({severity: 'error', summary: '', detail: onerror._body})
        );
    }

    saveClick() {
        this.companyService
        .save(this.company)
        .subscribe(result => {
            this.company = result;
            Helpers.setInfos(result);
            this.translate.get('Company saved!').subscribe((res: string) =>
                this.messageService.add({severity: 'success', summary: '', detail: res}));
        }, onerror => this.messageService.add({severity: 'error', summary: '', detail: onerror._body}));
    }

    myUploader(event, form) {
        const formDate: FormData = new FormData();
        event.files.forEach(file => {
            formDate.append('file[]', file, file.name);
        });
        this.companyService.upload(formDate).subscribe(res => {
            this.translate.get('File Uploaded!').subscribe((resp: string) =>
                this.messageService.add({severity: 'info', summary: resp, detail: res.name}));

            if (res.name === 'logo.png') {
                this.sessionService.logo = null;
                this.sessionService.logo = '/media/logo.png?' + new Date().getTime();
            } else {
                this.header = null;
                this.header = '/media/header.png?' + new Date().getTime();
            }
            form.clear();
        });
    }
}

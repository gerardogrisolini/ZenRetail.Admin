import { Headers } from '@angular/http';
import { SelectItem, TreeNode } from 'primeng/primeng';
import { Company, Translation } from './models';
import { HttpHeaders } from '@angular/common/http';

export class Helpers {

    static currency = 'EUR';
    static utc = 'UTC';
    static locales: SelectItem[] = [];
    static locale: any;

    static distinct(a: any[]): any[] {
        const seen: any = {};
        const out: any[] = [];
        const len = a.length;
        let j = 0;
        for (let i = 0; i < len; i++) {
            const item = a[i];
            if (seen[item.label] !== 1) {
                seen[item.label] = 1;
                out[j++] = item;
            }
        }
        return out;
    }

    // static getHeaders(contentType = 'application/json'): HttpHeaders {
    //     const headers = new HttpHeaders();
    //     headers.append('Authorization', `Bearer ${localStorage.getItem('token')}`);
    //     headers.append('Content-Type', contentType);
    //     return headers;
    // }

    static newSelectItem(value: any, label?: string): SelectItem {
        return <SelectItem>{ label: label ? label : value, value: value };
    }

    static newNode(label: string, data: string, type: string): TreeNode {
        return <TreeNode>{
                'label': label,
                'data': data,
                'type': type,
                'children': []
        };
    }

    static getUnitOfMeasure(): SelectItem[] {
        return <SelectItem[]>[
            Helpers.newSelectItem('QT', 'Quantity'),
            Helpers.newSelectItem('MT', 'Meter'),
            Helpers.newSelectItem('KG', 'Kilogram')
        ];
    }

    static setInfos(company: Company) {
        this.locales = [];
        this.currency = company.companyCurrency;
        this.utc = company.companyUtc;
        if (company.companyLocales.length > 0) {
            this.locales = company.companyLocales.map(p => this.newSelectItem(p.country, p.value));
        } else {
            this.locales.push(this.newSelectItem('EN', 'English'));
            this.locales.push(this.newSelectItem('IT', 'Italian'));
            company.companyLocales = this.locales.map(p => new Translation(p.value, p.label));
        }
    }
}

import { Component, OnInit, Input } from '@angular/core';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { SessionService } from './../services/session.service';
import { Discount } from './../shared/models';
import { Helpers } from './helpers';

@Component({
    selector: 'app-discount',
    templateUrl: 'discount.component.html'
})

export class DiscountComponent implements OnInit {
    @Input() discount: Discount;
    public helpers = Helpers;
    dataform: FormGroup;
    dateStartValue: Date;
    dateFinishValue: Date;

    constructor(
        private sessionService: SessionService,
        private fb: FormBuilder) {
    }

    ngOnInit() {
        this.sessionService.checkCredentials(false);

        this.dataform = this.fb.group({
            'percentage': new FormControl('', Validators.nullValidator),
            'price': new FormControl('', Validators.nullValidator),
            'start': new FormControl('', Validators.required),
            'finish': new FormControl('', Validators.required)
        });
    }
}

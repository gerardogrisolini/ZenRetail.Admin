import { Component, OnInit } from '@angular/core';
import { Validators, FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { Product } from './../shared/models';
import { ProductService } from './../services/product.service';

@Component({
    selector: 'app-detail',
    templateUrl: 'detail.component.html'
})

export class DetailComponent implements OnInit {
    detailform: FormGroup;

    constructor(
        private fb: FormBuilder,
        private productService: ProductService
    ) { }

    get selected(): Product { return this.productService.product; }

    ngOnInit() {
        this.detailform = this.fb.group({
            'selling': new FormControl('', Validators.required),
            'purchase': new FormControl('', Validators.required),
            'weight': new FormControl('', Validators.required),
            'length': new FormControl('', Validators.required),
            'width': new FormControl('', Validators.required),
            'height': new FormControl('', Validators.required)
       });
    }

    saveClick() {

    }
}

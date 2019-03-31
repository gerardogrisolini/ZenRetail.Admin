import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { MessageService } from 'primeng/components/common/messageservice';
import { SessionService } from './../services/session.service';
import { MovementService } from './../services/movement.service';
import { CompanyService } from './../services/company.service';
import { MovementArticle, PdfDocument } from './../shared/models';
import * as FileSaver from 'file-saver';

@Component({
    selector: 'app-barcode-component',
    templateUrl: 'barcode.component.html'
})

export class BarcodeComponent implements OnInit, OnDestroy {
    @ViewChild('doc') doc: ElementRef;
    private sub: any;
    movementId: number;
    items: MovementArticle[];
    isBusy: boolean;

    constructor(@Inject(DOCUMENT) private document: any,
                private location: Location,
                private activatedRoute: ActivatedRoute,
                private messageService: MessageService,
                private sessionService: SessionService,
                private companyService: CompanyService,
                private movementService: MovementService) {
    }

    ngOnInit() {
        this.sessionService.checkCredentials(false);
        this.sessionService.setTitle('Barcode');

        // Subscribe to route params
        this.sub = this.activatedRoute.params.subscribe(params => {
            this.movementId = Number(params['id']);
            this.isBusy = true;

            this.movementService.getItemsById(this.movementId)
                .subscribe(
                    result => {
                        this.loadBarcode(result);
                    },
                    onerror => this.messageService.add({severity: 'error', summary: '', detail: onerror._body}),
                    () => this.isBusy = false
            );
        });
    }

    loadBarcode(result: MovementArticle[]) {
        this.items = [];
        result.forEach(p => {
            for (let i = 1; i <= p.movementArticleQuantity; i++) {
                this.items.push(p);
            }
        });
    }

    ngOnDestroy() {
        // Clean sub to avoid memory leak
        this.sub.unsubscribe();
    }

    cancelClick() {
        this.location.back();
    }

    pdfClick() {
        this.isBusy = true;

        const model = new PdfDocument()
        model.size = '6cm*4cm';
        model.subject = 'barcode_' + this.movementId + '.pdf';
        model.content = this.doc.nativeElement.innerHTML;

        this.companyService
            .htmlToPdf(model)
            .subscribe(
                data => {
                    const blob = new Blob([data], {type: 'application/pdf'});
                    FileSaver.saveAs(blob, model.subject);
                },
                err => console.error(err),
                () => this.isBusy = false
            );
    }
}

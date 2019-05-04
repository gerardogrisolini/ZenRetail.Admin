import { Component, OnInit, Input, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/primeng';
import { CompanyService } from '../services/company.service';
import { Media } from './../shared/models';
import { SessionService } from './../services/session.service';

@Component({
    selector: 'app-media',
    templateUrl: 'media.component.html'
})

export class MediaComponent implements OnInit {
    @Input() @Output() media?: Media;
    @Input() medias: Media[];
    selectedMedia: string;

    constructor(
        private confirmationService: ConfirmationService,
        private translate: TranslateService,
        private sessionService: SessionService,
        private companyService: CompanyService) {
    }

    ngOnInit() {
        this.sessionService.checkCredentials(false);

        if (this.media) {
            this.medias = [];
            this.medias.push(this.media);
        }
        if (this.medias && this.medias.length > 0) {
            this.selectMedia(this.medias[0].name);
        }
    }

    selectMedia(name: string) {
        this.selectedMedia = '/media/' + name;
    }

    myUploader(event, form) {
        const formDate: FormData = new FormData();
        event.files.forEach(file => {
            formDate.append('file[]', file, file.name);
        });

        if (this.media) {
            this.companyService.upload(formDate).subscribe(media => {
                this.media.contentType = media.contentType;
                this.media.name = media.name;
                this.selectMedia(this.media.name);
                form.clear();
            });
        } else {
            this.companyService.uploads(formDate).subscribe(res => {
                res.forEach(media => {
                    this.medias.push(media);
                    this.selectMedia(media.name);
                });
                form.clear();
            });
        }
    }

    deleteMediaClick(item) {
        this.translate.get('Are you sure that you want to delete this media?')
            .subscribe((res: string) => this.confirmationService.confirm({
                message: res,
                accept: () => {
                    const index = this.medias.indexOf(item);
                    this.medias.splice(index, 1);
                }
            })
        );
    }
}

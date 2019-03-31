import { Component, OnInit  } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SessionService } from './../services/session.service';
import { Helpers } from '../shared/helpers';

@Component({
    selector: 'home-component',
    templateUrl: 'home.component.html'
})

export class HomeComponent implements OnInit  {

    token: string;

    constructor(private activatedRoute: ActivatedRoute,
                private sessionService: SessionService) {
    }

    ngOnInit() {
        this.sessionService.setTitle('Home');

        if (this.sessionService.isAuthenticated) {
            this.token = localStorage.getItem('token');

            this.sessionService.getSetting()
                .subscribe(result => {
                    Helpers.setInfos(result);
                }, onerror => console.log(onerror)
            );
        }

        // this.sessionService.getCredentials()
        //     .subscribe(res => {
        //         alert(JSON.stringify(res));
        //     });
     }
}

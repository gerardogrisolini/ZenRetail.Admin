import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { SessionService } from './services/session.service';
import { Helpers } from './shared/helpers';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-component',
    templateUrl: './app.component.html',
    animations: [
        trigger('overlayState', [
            state('hidden', style({
                opacity: 0
            })),
            state('visible', style({
                opacity: 1
            })),
            transition('visible => hidden', animate('400ms ease-in')),
            transition('hidden => visible', animate('400ms ease-out'))
        ])
    ],
  })

export class AppComponent implements OnInit {

    constructor(
        public sessionService: SessionService,
        private translate: TranslateService
    ) {
        const country = navigator.language.substring(0, 2).toLowerCase();
        // this language will be used as a fallback when a translation isn't found in the current language
        // this.translate.setDefaultLang('en');
        // the lang to use, if the lang isn't available, it will use the current loader to get them
        this.translate.use(country);

        if (country !== 'it') {
            Helpers.locale = {
                firstDayOfWeek: 0,
                dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                dayNamesMin: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
                monthNames: [
                    'January',
                    'February',
                    'March',
                    'April',
                    'May',
                    'June',
                    'July',
                    'August',
                    'September',
                    'October',
                    'November',
                    'December'
                ],
                monthNamesShort: [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ],
                today: 'Today',
                clear: 'Clear'
            };
        } else {
            Helpers.locale = {
                firstDayOfWeek: 0,
                dayNames: ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'],
                dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'],
                dayNamesMin: ['Do', 'Lu', 'Ma', 'Me', 'Gi', 'Ve', 'Sa'],
                monthNames: [
                    'Gennaio',
                    'Febbraio',
                    'Marzo',
                    'Aprile',
                    'Maggio',
                    'Giugno',
                    'Luglio',
                    'Agosto',
                    'Settembre',
                    'Ottobre',
                    'Novembre',
                    'Dicembre'
                ],
                monthNamesShort: [ 'Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dec' ],
                today: 'Oggi',
                clear: 'Pulisci'
            };
        }
    }

    get menuActive(): boolean { return this.sessionService.menuActive; }

    ngOnInit() {
        if (this.sessionService.isAuthenticated) {
            this.sessionService.getSetting()
                .subscribe(result => {
                    Helpers.setInfos(result);
                }, onerror => console.log(onerror)
            );
        }
    }
}

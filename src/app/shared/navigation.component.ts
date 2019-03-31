import { Component } from '@angular/core';
import { SessionService } from './../services/session.service';

@Component({
    selector: 'navigation',
    templateUrl: 'navigation.component.html'
})

export class NavigationComponent {

    constructor(public sessionService: SessionService) {
    }

    set menuActive(value) { this.sessionService.menuActive = value; }
    get menuActive(): boolean { return this.sessionService.menuActive; }

    get isAuthenticated(): boolean {
        return this.sessionService.isAuthenticated;
    }

    get isAdmin(): boolean {
        return this.sessionService.isAdmin;
    }

    onMenuButtonClick(event: Event) {
        this.menuActive = !this.menuActive;
        event.preventDefault();
    }

    onMenuItemClick() {
        const width = window.innerWidth
            || document.documentElement.clientWidth
            || document.body.clientWidth;
        if (width < 1024) {
            this.menuActive = false;
        }
    }

    logoutClick() {
        this.sessionService.logout();
        this.menuActive = false;
    }
}

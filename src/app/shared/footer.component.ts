import { Component } from '@angular/core';

@Component({
    selector: 'customfooter',
    templateUrl: 'footer.component.html'
})

export class FooterComponent {
    public currentYear: number = new Date().getFullYear();
}

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { Login, Token, Company } from '../shared/models';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class SessionService {

    logo: string;
    title: string;
    username: string;
    menuActive: boolean;
    titleSidebar: string;

    constructor(private router: Router, private http: HttpClient, private translate: TranslateService) {
        this.logo = '/media/logo.png';
        this.title = '';
        this.titleSidebar = '';
        this.username = localStorage.getItem('username');
        this.initMenu();
    }

    get visibleSidebar(): boolean { return this.titleSidebar !== '' };

    initMenu() {
        const width = window.innerWidth
            || document.documentElement.clientWidth
            || document.body.clientWidth;
        this.menuActive = width > 1024;
    }

    setTitle(title) {
        if (!this.visibleSidebar) {
            this.translate.get(title).subscribe((res: string) => this.title = res);
        }
    }

    login(user: Login): Observable<Token> {
        return this.http.post<Token>('/api/login', user);
    }

    logout() {
        const body = { token: localStorage.getItem('token') };
        this.http.post<any>('/api/logout', body)
           .subscribe(result => this.username = '');
        this.removeCredentials();
    }

    grantCredentials(username: string, data: Token) {
        this.username = username;
        localStorage.setItem('username', username);
        // localStorage.setItem('uniqueID', data.uniqueID);
        localStorage.setItem('token', data.bearer);
        localStorage.setItem('role', "Admin");
        this.router.navigate(['home']);
    }

    removeCredentials() {
        localStorage.removeItem('username');
        //localStorage.removeItem('uniqueID');
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        this.router.navigate(['home']);
    }

    get isAuthenticated(): boolean {
        return localStorage.getItem('token') != null && localStorage.getItem('role') !== 'Registry';
    }

    get isAdmin(): boolean {
        return localStorage.getItem('role') === 'Admin';
    }

    checkCredentials(isAdmin: boolean) {
        if (!this.isAuthenticated || isAdmin && !this.isAdmin) {
            this.removeCredentials();
        }
    }

    getCredentials(): Observable<any>  {
        return this.http.get<any>('/api/authenticated');
    }

    getSetting(): Observable<Company> {
        return this.http.get<Company>('/api/company');
    }
}

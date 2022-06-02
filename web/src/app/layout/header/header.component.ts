import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs';
import { AuthService } from 'src/app/authentication/services/auth.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
    public loaded = this.auth.user.pipe(map(() => true));
    public loggedIn = this.auth.user.pipe(map((user) => user !== null));

    constructor(public auth: AuthService) {}

    ngOnInit(): void {}

    public logout() {
        this.auth.logOut();
    }
}

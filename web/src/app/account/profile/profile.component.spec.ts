import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject } from 'rxjs';
import { UserInfo } from 'src/app/authentication/models/user-info';
import { AuthService } from 'src/app/authentication/services/auth.service';
import { AccountService } from '../services/account.service';
import { ProfileComponent } from './profile.component';

describe('ProfileComponent', () => {
    let component: ProfileComponent;
    let fixture: ComponentFixture<ProfileComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            declarations: [ProfileComponent],
            providers: [
                { provide: AccountService, useValue: {} },
                { provide: AuthService, useValue: { user: new BehaviorSubject<UserInfo | null>(null) } },
                { provide: MatSnackBar, useValue: {} },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ProfileComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

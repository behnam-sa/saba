import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { AttemptService } from '../services/attempt.service';

import { BeginAttemptComponent } from './begin-attempt.component';

describe('BeginAttemptComponent', () => {
    let component: BeginAttemptComponent;
    let fixture: ComponentFixture<BeginAttemptComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [BeginAttemptComponent],
            imports: [MatSnackBarModule, RouterTestingModule],
            providers: [{ provide: AttemptService, useValue: {} }],
        }).compileComponents();

        fixture = TestBed.createComponent(BeginAttemptComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

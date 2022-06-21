import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { AlphabeticalNumberingService } from 'src/app/services/alphabetical-numbering';
import { AnswerService } from '../services/answer.service';
import { AttemptService } from '../services/attempt.service';
import { AttemptingComponent } from './attempting.component';

describe('AttemptingComponent', () => {
    let component: AttemptingComponent;
    let fixture: ComponentFixture<AttemptingComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AttemptingComponent],
            imports: [MatSnackBarModule, RouterTestingModule],
            providers: [
                AlphabeticalNumberingService,
                { provide: AttemptService, useValue: {} },
                { provide: AnswerService, useValue: {} },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(AttemptingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

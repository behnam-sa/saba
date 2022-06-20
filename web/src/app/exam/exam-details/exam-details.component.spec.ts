import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { ExamService } from '../services/exam.service';
import { OptionService } from '../services/option.service';
import { QuestionService } from '../services/question.service';
import { ExamDetailsComponent } from './exam-details.component';

describe('ExamDetailsComponent', () => {
    let component: ExamDetailsComponent;
    let fixture: ComponentFixture<ExamDetailsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ExamDetailsComponent],
            imports: [MatSnackBarModule, RouterTestingModule],
            providers: [
                { provide: ExamService, useValue: {} },
                { provide: QuestionService, useValue: {} },
                { provide: OptionService, useValue: {} },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(ExamDetailsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

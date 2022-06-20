import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ExamService } from '../services/exam.service';
import { CreateExamDialogComponent } from './create-exam-dialog.component';

describe('CreateExamDialogComponent', () => {
    let component: CreateExamDialogComponent;
    let fixture: ComponentFixture<CreateExamDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CreateExamDialogComponent],
            imports: [MatDialogModule, MatSnackBarModule],
            providers: [
                { provide: ExamService, useValue: {} },
                { provide: MatDialogRef, useValue: {} },
                { provide: MAT_DIALOG_DATA, useValue: { courseId: 11, exam: { name: 'a' } } },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(CreateExamDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

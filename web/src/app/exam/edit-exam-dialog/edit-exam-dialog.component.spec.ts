import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ExamService } from '../services/exam.service';
import { EditExamDialogComponent } from './edit-exam-dialog.component';

describe('EditExamDialogComponent', () => {
    let component: EditExamDialogComponent;
    let fixture: ComponentFixture<EditExamDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EditExamDialogComponent],
            imports: [MatDialogModule, MatSnackBarModule],
            providers: [
                { provide: ExamService, useValue: {} },
                { provide: MatDialogRef, useValue: {} },
                { provide: MAT_DIALOG_DATA, useValue: { courseId: 11, exam: { name: 'a' } } },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(EditExamDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { CourseDetails } from 'src/app/course/models/course-details';
import { ExamService } from '../services/exam.service';
import { ExamListComponent } from './exam-list.component';

describe('ExamListComponent', () => {
    let component: ExamListComponent;
    let fixture: ComponentFixture<ExamListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ExamListComponent],
            imports: [MatSnackBarModule, MatDialogModule],
            providers: [{ provide: ExamService, useValue: { getExams: () => of([]) } }],
        }).compileComponents();

        fixture = TestBed.createComponent(ExamListComponent);
        component = fixture.componentInstance;
        component.course = { id: 6, name: 'aaa' } as CourseDetails;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

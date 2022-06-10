import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { CourseService } from '../services/course.service';
import { CreateCourseDialogComponent } from './create-course-dialog.component';

describe('CreateCourseDialogComponent', () => {
    let component: CreateCourseDialogComponent;
    let fixture: ComponentFixture<CreateCourseDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CreateCourseDialogComponent],
            imports: [MatDialogModule, MatSnackBarModule],
            providers: [
                { provide: CourseService, useValue: { createCourse: () => of() } },
                { provide: MatDialogRef, useValue: {} },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CreateCourseDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

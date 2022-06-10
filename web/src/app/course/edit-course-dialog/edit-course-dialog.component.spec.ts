import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { CourseService } from '../services/course.service';
import { EditCourseDialogComponent } from './edit-course-dialog.component';

describe('EditCourseDialogComponent', () => {
    let component: EditCourseDialogComponent;
    let fixture: ComponentFixture<EditCourseDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EditCourseDialogComponent],
            imports: [MatDialogModule, MatSnackBarModule],
            providers: [
                { provide: CourseService, useValue: { deleteCourse: () => of() } },
                { provide: MatDialogRef, useValue: {} },
                { provide: MAT_DIALOG_DATA, useValue: { name: 'a', description: '' } },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EditCourseDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

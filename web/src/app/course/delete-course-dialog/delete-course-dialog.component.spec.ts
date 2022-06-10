import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { CourseService } from '../services/course.service';
import { DeleteCourseDialogComponent } from './delete-course-dialog.component';

describe('DeleteCourseDialogComponent', () => {
    let component: DeleteCourseDialogComponent;
    let fixture: ComponentFixture<DeleteCourseDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DeleteCourseDialogComponent],
            imports: [MatDialogModule, MatSnackBarModule],
            providers: [
                { provide: CourseService, useValue: { deleteCourse: () => of() } },
                { provide: MatDialogRef, useValue: {} },
                { provide: MAT_DIALOG_DATA, useValue: {} },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DeleteCourseDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

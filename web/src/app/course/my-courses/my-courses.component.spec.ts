import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSortModule } from '@angular/material/sort';
import { of } from 'rxjs';
import { CourseService } from '../services/course.service';
import { MyCoursesComponent } from './my-courses.component';

describe('MyCoursesComponent', () => {
    let component: MyCoursesComponent;
    let fixture: ComponentFixture<MyCoursesComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [MyCoursesComponent],
            imports: [MatDialogModule, MatSortModule],
            providers: [
                {
                    provide: CourseService,
                    useValue: {
                        getAttendedCourses: () => of([]),
                        getCreatedCourses: () => of([]),
                    },
                },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(MyCoursesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

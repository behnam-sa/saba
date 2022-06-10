import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSortModule } from '@angular/material/sort';
import { of } from 'rxjs';
import { CourseService } from '../services/course.service';
import { CourseListComponent } from './course-list.component';

describe('CourseListComponent', () => {
    let component: CourseListComponent;
    let fixture: ComponentFixture<CourseListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CourseListComponent],
            imports: [MatSortModule],
            providers: [{ provide: CourseService, useValue: { getCourses: () => of([]) } }],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CourseListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

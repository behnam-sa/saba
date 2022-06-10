import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { CourseService } from '../services/course.service';
import { CourseDetailsComponent } from './course-details.component';

describe('CourseDetailsComponent', () => {
    let component: CourseDetailsComponent;
    let fixture: ComponentFixture<CourseDetailsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CourseDetailsComponent],
            providers: [
                { provide: CourseService, useValue: {} },
                { provide: ActivatedRoute, useValue: { paramMap: of(convertToParamMap({ id: 2 })) } },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CourseDetailsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
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
            imports: [RouterTestingModule, MatSnackBarModule, MatDialogModule],
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

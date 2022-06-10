import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CourseDetails } from '../models/course-details';
import { CourseService } from '../services/course.service';

@Component({
    selector: 'app-course-details',
    templateUrl: './course-details.component.html',
    styleUrls: ['./course-details.component.scss'],
})
export class CourseDetailsComponent implements OnInit {
    public course?: CourseDetails;
    public loading: boolean = true;

    constructor(private courseService: CourseService, private route: ActivatedRoute) {}

    ngOnInit(): void {
        this.route.paramMap.subscribe((params) => {
            const id = parseInt(params.get('id')!);
            this.loadCourse(id);
        });
    }

    private loadCourse(id: number) {
        this.courseService.getCourse(id).subscribe({
            next: (course) => {
                this.course = course;
                this.loading = false;
            },
            error: () => {
                this.loading = false;
            },
        });
    }
}

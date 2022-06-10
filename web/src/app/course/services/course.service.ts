import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { CourseDetails } from '../models/course-details';
import { CourseInfo } from '../models/course-info';
import { CourseInfoCreate } from '../models/course-info-create';
import { CourseInfoEdit } from '../models/course-info-edit';

@Injectable()
export class CourseService {
    constructor(private api: ApiService) {}

    public getCourses(): Observable<CourseInfo[]> {
        return this.api
            .get<CourseInfo[]>('course')
            .pipe(map((data) => data.map((course) => this.parseCourseInfo(course))));
    }

    public getCreatedCourses(): Observable<CourseInfo[]> {
        return this.api
            .get<CourseInfo[]>('course/created')
            .pipe(map((data) => data.map((course) => this.parseCourseInfo(course))));
    }

    public getAttendedCourses(): Observable<CourseInfo[]> {
        return this.api
            .get<CourseInfo[]>('course/attended')
            .pipe(map((data) => data.map((course) => this.parseCourseInfo(course))));
    }

    public getCourse(id: number): Observable<CourseDetails> {
        return this.api.get<CourseDetails>(`course/${id}`).pipe(map((course) => this.parseCourseDetails(course)));
    }

    public createCourse(course: CourseInfoCreate): Observable<CourseInfo> {
        return this.api.post<CourseInfo>(`course`, course).pipe(map((course) => this.parseCourseInfo(course)));
    }

    public editCourse(id: number, courseEdit: CourseInfoEdit): Observable<void> {
        return this.api.put<void>(`course/${id}`, courseEdit);
    }

    public deleteCourse(id: number): Observable<void> {
        return this.api.delete<void>(`course/${id}`);
    }

    public attendCourse(id: number): Observable<void> {
        return this.api.post<void>(`course/attend/${id}`);
    }

    public unattendCourse(id: number): Observable<void> {
        return this.api.post<void>(`course/unattend/${id}`);
    }

    private parseCourseInfo<T extends CourseInfo>(data: T): T {
        return {
            ...data,
            creationDate: new Date(data.creationDate),
        };
    }

    private parseCourseDetails(data: CourseDetails): CourseDetails {
        return this.parseCourseInfo(data);
    }
}

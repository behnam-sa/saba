import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CourseRoutingModule } from './course-routing.module';
import { CourseComponent } from './course.component';
import { CourseListComponent } from './course-list/course-list.component';
import { MyCoursesComponent } from './my-courses/my-courses.component';

@NgModule({
    declarations: [CourseComponent, CourseListComponent, MyCoursesComponent],
    imports: [CommonModule, CourseRoutingModule],
})
export class CourseModule {}

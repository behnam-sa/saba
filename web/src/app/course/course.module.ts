import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
import { CourseDetailsComponent } from './course-details/course-details.component';
import { CourseListComponent } from './course-list/course-list.component';
import { CourseRoutingModule } from './course-routing.module';
import { CourseComponent } from './course.component';
import { CreateCourseDialogComponent } from './create-course-dialog/create-course-dialog.component';
import { DeleteCourseDialogComponent } from './delete-course-dialog/delete-course-dialog.component';
import { EditCourseDialogComponent } from './edit-course-dialog/edit-course-dialog.component';
import { MyCoursesComponent } from './my-courses/my-courses.component';
import { CourseService } from './services/course.service';

@NgModule({
    declarations: [
        CourseComponent,
        CourseListComponent,
        MyCoursesComponent,
        CourseDetailsComponent,
        CreateCourseDialogComponent,
        EditCourseDialogComponent,
        DeleteCourseDialogComponent,
    ],
    imports: [CommonModule, FormsModule, ReactiveFormsModule, MaterialModule, CourseRoutingModule],
    providers: [CourseService],
})
export class CourseModule {}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthorizeGuard } from '../authentication/guards/authorize.guard';
import { CourseDetailsComponent } from './course-details/course-details.component';
import { CourseListComponent } from './course-list/course-list.component';
import { CourseComponent } from './course.component';
import { MyCoursesComponent } from './my-courses/my-courses.component';

const routes: Routes = [
    {
        path: '',
        component: CourseComponent,
        children: [
            {
                path: 'mine',
                canActivate: [AuthorizeGuard],
                component: MyCoursesComponent,
            },
            {
                path: ':id',
                children: [
                    {
                        path: 'exam',
                        loadChildren: () => import('../exam/exam.module').then((module) => module.ExamModule),
                    },
                    {
                        path: '',
                        component: CourseDetailsComponent,
                    },
                ],
            },
            {
                path: '',
                component: CourseListComponent,
            },
            {
                path: '**',
                redirectTo: '/',
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class CourseRoutingModule {}

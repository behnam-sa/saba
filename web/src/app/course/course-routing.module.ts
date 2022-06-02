import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountComponent } from '../account/account.component';
import { AuthorizeGuard } from '../authentication/guards/authorize.guard';
import { CourseListComponent } from './course-list/course-list.component';
import { MyCoursesComponent } from './my-courses/my-courses.component';

const routes: Routes = [
    {
        path: '',
        component: AccountComponent,
        children: [
            {
                path: 'mine',
                canActivate: [AuthorizeGuard],
                component: MyCoursesComponent,
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

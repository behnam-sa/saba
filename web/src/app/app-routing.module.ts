import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: 'account',
        loadChildren: () => import('./account/account.module').then((module) => module.AccountModule),
    },
    {
        path: 'course',
        loadChildren: () => import('./course/course.module').then((module) => module.CourseModule),
    },
    {
        path: '**',
        redirectTo: 'course',
    },
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {
            paramsInheritanceStrategy: 'always',
        }),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {}

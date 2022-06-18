import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExamDetailsComponent } from './exam-details/exam-details.component';
import { ExamComponent } from './exam.component';

const routes: Routes = [
    {
        path: '',
        component: ExamComponent,
        children: [
            {
                path: ':id',
                component: ExamDetailsComponent,
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
export class ExamRoutingModule {}

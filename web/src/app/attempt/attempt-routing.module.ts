import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AttemptResultComponent } from './attempt-result/attempt-result.component';
import { AttemptComponent } from './attempt.component';
import { AttemptingComponent } from './attempting/attempting.component';
import { BeginAttemptComponent } from './begin-attempt/begin-attempt.component';

const routes: Routes = [
    {
        path: '',
        component: AttemptComponent,
        children: [
            {
                path: 'begin',
                component: BeginAttemptComponent,
            },
            {
                path: 'inprogress',
                component: AttemptingComponent,
            },
            {
                path: 'result',
                component: AttemptResultComponent,
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AttemptRoutingModule {}

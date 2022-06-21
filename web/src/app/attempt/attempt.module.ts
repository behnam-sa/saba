import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
import { AttemptResultComponent } from './attempt-result/attempt-result.component';
import { AttemptRoutingModule } from './attempt-routing.module';
import { AttemptComponent } from './attempt.component';
import { AttemptingComponent } from './attempting/attempting.component';
import { BeginAttemptComponent } from './begin-attempt/begin-attempt.component';
import { AnswerService } from './services/answer.service';
import { AttemptService } from './services/attempt.service';

@NgModule({
    declarations: [AttemptComponent, AttemptingComponent, BeginAttemptComponent, AttemptResultComponent],
    imports: [CommonModule, FormsModule, ReactiveFormsModule, MaterialModule, AttemptRoutingModule],
    providers: [AttemptService, AnswerService],
})
export class AttemptModule {}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../material/material.module';
import { CreateExamDialogComponent } from './create-exam-dialog/create-exam-dialog.component';
import { DeleteExamDialogComponent } from './delete-exam-dialog/delete-exam-dialog.component';
import { EditExamDialogComponent } from './edit-exam-dialog/edit-exam-dialog.component';
import { ExamDetailsComponent } from './exam-details/exam-details.component';
import { ExamListComponent } from './exam-list/exam-list.component';
import { ExamRoutingModule } from './exam-routing.module';
import { ExamComponent } from './exam.component';
import { ExamService } from './services/exam.service';
import { OptionService } from './services/option.service';
import { QuestionService } from './services/question.service';

@NgModule({
    declarations: [
        ExamComponent,
        ExamListComponent,
        ExamDetailsComponent,
        CreateExamDialogComponent,
        EditExamDialogComponent,
        DeleteExamDialogComponent,
    ],
    imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, MaterialModule, ExamRoutingModule],
    providers: [ExamService, QuestionService, OptionService],
    exports: [ExamListComponent],
})
export class ExamModule {}

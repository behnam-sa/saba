import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ExamInfoCreate } from '../models/exam-info-create';
import { ExamService } from '../services/exam.service';

@Component({
    selector: 'app-create-exam-dialog',
    templateUrl: './create-exam-dialog.component.html',
    styleUrls: ['./create-exam-dialog.component.scss'],
})
export class CreateExamDialogComponent implements OnInit {
    public form: FormGroup = new FormGroup({
        name: new FormControl(''),
    });

    public sendingRequest: boolean = false;

    constructor(
        private examService: ExamService,
        public dialogRef: MatDialogRef<CreateExamDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { courseId: number },
        private snackBar: MatSnackBar
    ) {}

    ngOnInit(): void {}

    public create(): void {
        const data: ExamInfoCreate = this.form.value;
        this.sendingRequest = true;

        this.examService.createExam(this.data.courseId, data).subscribe({
            next: () => {
                this.sendingRequest = false;
                this.dialogRef.close(true);
            },
            error: (error) => {
                if (error instanceof HttpErrorResponse) {
                    const message = error.error?.message ?? 'خطا در ایجاد آزمون';
                    this.snackBar.open(message, undefined, {
                        duration: 3000,
                        verticalPosition: 'bottom',
                        horizontalPosition: 'center',
                        panelClass: 'warn-snackbar',
                    });
                }
                this.sendingRequest = false;
            },
        });
    }
}

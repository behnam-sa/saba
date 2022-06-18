import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ExamInfo } from '../models/exam-info';
import { ExamInfoEdit } from '../models/exam-info-edit';
import { ExamService } from '../services/exam.service';

@Component({
    selector: 'app-edit-exam-dialog',
    templateUrl: './edit-exam-dialog.component.html',
    styleUrls: ['./edit-exam-dialog.component.scss'],
})
export class EditExamDialogComponent implements OnInit {
    public form: FormGroup = new FormGroup({
        name: new FormControl(''),
    });

    public sendingRequest: boolean = false;

    constructor(
        private examService: ExamService,
        public dialogRef: MatDialogRef<EditExamDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { courseId: number; exam: ExamInfo },
        private snackBar: MatSnackBar
    ) {
        this.form.setValue({
            name: data.exam.name,
        });
    }

    ngOnInit(): void {}

    public edit(): void {
        const data: ExamInfoEdit = this.form.value;
        this.sendingRequest = true;

        this.examService.editExam(this.data.courseId, this.data.exam.id, data).subscribe({
            next: () => {
                this.sendingRequest = false;
                this.dialogRef.close(true);
            },
            error: (error) => {
                if (error instanceof HttpErrorResponse) {
                    const message = error.error?.message ?? 'خطا در ویرایش آزمون';
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

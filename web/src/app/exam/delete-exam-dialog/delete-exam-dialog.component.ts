import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ExamInfo } from '../models/exam-info';
import { ExamService } from '../services/exam.service';

@Component({
    selector: 'app-delete-exam-dialog',
    templateUrl: './delete-exam-dialog.component.html',
    styleUrls: ['./delete-exam-dialog.component.scss'],
})
export class DeleteExamDialogComponent implements OnInit {
    public sendingRequest: boolean = false;

    constructor(
        private examService: ExamService,
        public dialogRef: MatDialogRef<DeleteExamDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { courseId: number; exam: ExamInfo },
        private snackBar: MatSnackBar
    ) {}

    ngOnInit(): void {}

    public delete(): void {
        this.sendingRequest = true;

        this.examService.deleteExam(this.data.courseId, this.data.exam.id).subscribe({
            next: () => {
                this.sendingRequest = false;
                this.dialogRef.close(true);
            },
            error: (error) => {
                if (error instanceof HttpErrorResponse) {
                    const message = error.error?.message ?? 'خطا در حذف آزمون';
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

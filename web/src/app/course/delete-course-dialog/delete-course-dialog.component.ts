import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CourseInfo } from '../models/course-info';
import { CourseService } from '../services/course.service';

@Component({
    selector: 'app-delete-course-dialog',
    templateUrl: './delete-course-dialog.component.html',
    styleUrls: ['./delete-course-dialog.component.scss'],
})
export class DeleteCourseDialogComponent implements OnInit {
    public sendingRequest: boolean = false;

    constructor(
        private courseService: CourseService,
        public dialogRef: MatDialogRef<DeleteCourseDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: CourseInfo,
        private snackBar: MatSnackBar
    ) {}

    ngOnInit(): void {}

    public delete(): void {
        this.sendingRequest = true;

        this.courseService.deleteCourse(this.data.id).subscribe({
            next: () => {
                this.sendingRequest = false;
                this.dialogRef.close(true);
            },
            error: (error) => {
                if (error instanceof HttpErrorResponse) {
                    const message = error.error?.message ?? 'خطا در حذف دوره';
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

import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CourseInfo } from '../models/course-info';
import { CourseInfoEdit } from '../models/course-info-edit';
import { CourseService } from '../services/course.service';

@Component({
    selector: 'app-edit-course-dialog',
    templateUrl: './edit-course-dialog.component.html',
    styleUrls: ['./edit-course-dialog.component.scss'],
})
export class EditCourseDialogComponent implements OnInit {
    public form: FormGroup = new FormGroup({
        name: new FormControl(''),
        description: new FormControl(''),
    });

    public sendingRequest: boolean = false;

    constructor(
        private courseService: CourseService,
        public dialogRef: MatDialogRef<EditCourseDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: CourseInfo,
        private snackBar: MatSnackBar
    ) {
        this.form.setValue({
            name: data.name,
            description: data.description,
        });
    }

    ngOnInit(): void {}

    public edit(): void {
        const data: CourseInfoEdit = this.form.value;
        this.sendingRequest = true;

        this.courseService.editCourse(this.data.id, data).subscribe({
            next: () => {
                this.sendingRequest = false;
                this.dialogRef.close(true);
            },
            error: (error) => {
                if (error instanceof HttpErrorResponse) {
                    const message = error.error?.message ?? 'خطا در برقراری ارتباط با سرور';
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

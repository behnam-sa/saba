import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CourseInfoCreate } from '../models/course-info-create';
import { CourseService } from '../services/course.service';

@Component({
    selector: 'app-create-course-dialog',
    templateUrl: './create-course-dialog.component.html',
    styleUrls: ['./create-course-dialog.component.scss'],
})
export class CreateCourseDialogComponent implements OnInit {
    public form: FormGroup = new FormGroup({
        name: new FormControl(''),
        description: new FormControl(''),
    });

    public sendingRequest: boolean = false;

    constructor(
        private courseService: CourseService,
        public dialogRef: MatDialogRef<CreateCourseDialogComponent>,
        private snackBar: MatSnackBar
    ) {}

    ngOnInit(): void {}

    public create(): void {
        const data: CourseInfoCreate = this.form.value;
        this.sendingRequest = true;

        this.courseService.createCourse(data).subscribe({
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

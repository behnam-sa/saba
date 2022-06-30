import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthTokenService } from 'src/app/authentication/services/auth-token.service';
import { DeleteCourseDialogComponent } from '../delete-course-dialog/delete-course-dialog.component';
import { CourseDetails } from '../models/course-details';
import { CourseService } from '../services/course.service';

@Component({
    selector: 'app-course-details',
    templateUrl: './course-details.component.html',
    styleUrls: ['./course-details.component.scss'],
})
export class CourseDetailsComponent implements OnInit {
    public course?: CourseDetails;
    public loading: boolean = true;
    public changingAttendance: boolean = false;

    constructor(
        private courseService: CourseService,
        private authTokenService: AuthTokenService,
        private route: ActivatedRoute,
        private router: Router,
        private snackBar: MatSnackBar,
        private dialog: MatDialog
    ) {}

    ngOnInit(): void {
        this.route.paramMap.subscribe((params) => {
            const id = parseInt(params.get('courseId')!);
            this.loadCourse(id);
        });
    }

    private loadCourse(id: number) {
        this.courseService.getCourse(id).subscribe({
            next: (course) => {
                this.course = course;
                this.loading = false;
            },
            error: () => {
                this.loading = false;
            },
        });
    }

    public attend() {
        if (!this.authTokenService.isLoggedIn) {
            this.router.navigate(['/account/login']);
            return;
        }

        this.changingAttendance = true;
        this.courseService.attendCourse(this.course!.id).subscribe({
            next: () => {
                this.course!.isAttended = true;
                this.changingAttendance = false;
            },
            error: () => {
                this.showError('خطا در ثبت نام در دوره');
                this.changingAttendance = false;
            },
        });
    }

    public unattend() {
        this.changingAttendance = true;
        this.courseService.unattendCourse(this.course!.id).subscribe({
            next: () => {
                this.course!.isAttended = false;
                this.changingAttendance = false;
            },
            error: () => {
                this.showError('خطا در انصراف از دوره');
                this.changingAttendance = false;
            },
        });
    }

    public delete() {
        const dialogRef = this.dialog.open(DeleteCourseDialogComponent, {
            data: this.course,
        });

        dialogRef.afterClosed().subscribe((result: boolean) => {
            if (result) {
                this.snackBar.open('دوره با موفقیت حذف شد', undefined, {
                    duration: 3000,
                    verticalPosition: 'bottom',
                    horizontalPosition: 'center',
                    panelClass: 'accent-snackbar',
                });
                this.router.navigate(['/course/mine']);
            }
        });
    }

    private showError(message: string) {
        this.snackBar.open(message, undefined, {
            duration: 3000,
            verticalPosition: 'bottom',
            horizontalPosition: 'center',
            panelClass: 'warn-snackbar',
        });
    }
}

import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { CourseDetails } from 'src/app/course/models/course-details';
import { CreateExamDialogComponent } from '../create-exam-dialog/create-exam-dialog.component';
import { DeleteExamDialogComponent } from '../delete-exam-dialog/delete-exam-dialog.component';
import { EditExamDialogComponent } from '../edit-exam-dialog/edit-exam-dialog.component';
import { ExamInfo } from '../models/exam-info';
import { ExamOrders } from '../models/exam-orders';
import { ExamService } from '../services/exam.service';

@Component({
    selector: 'app-exam-list',
    templateUrl: './exam-list.component.html',
    styleUrls: ['./exam-list.component.scss'],
})
export class ExamListComponent implements OnInit, OnDestroy {
    @Input()
    public course!: CourseDetails;

    public displayedColumns: (keyof ExamInfo | 'drag-handle' | 'actions')[] = ['name', 'creationDate', 'actions'];
    public dataSource: MatTableDataSource<ExamInfo> = new MatTableDataSource<ExamInfo>();
    public loading: boolean = true;
    public dragDisabled = true;

    public dateTimeOptions: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    };

    private subscriptions: Subscription[] = [];

    constructor(private examService: ExamService, public dialog: MatDialog, private snackBar: MatSnackBar) {}

    ngOnInit(): void {
        this.loadData();

        if (this.course.isOwner) {
            this.displayedColumns.unshift('drag-handle');
        }
    }

    ngOnDestroy(): void {
        for (const subscription of this.subscriptions) subscription.unsubscribe();
    }

    private loadData() {
        this.subscriptions.push(
            this.examService.getExams(this.course.id).subscribe((exams) => {
                this.dataSource.data = exams;
                this.loading = false;
            })
        );
    }

    public createExam() {
        const dialogRef = this.dialog.open(CreateExamDialogComponent, {
            data: { courseId: this.course.id },
        });

        dialogRef.afterClosed().subscribe((result: boolean) => {
            if (result) this.loadData();
        });
    }

    public editExam(exam: ExamInfo) {
        const dialogRef = this.dialog.open(EditExamDialogComponent, {
            data: { courseId: this.course.id, exam: exam },
        });

        dialogRef.afterClosed().subscribe((result: boolean) => {
            if (result) this.loadData();
        });
    }

    public deleteExam(exam: ExamInfo) {
        const dialogRef = this.dialog.open(DeleteExamDialogComponent, {
            data: { courseId: this.course.id, exam: exam },
        });

        dialogRef.afterClosed().subscribe((result: boolean) => {
            if (result) this.loadData();
        });
    }

    public dropItem(event: CdkDragDrop<void>) {
        this.dragDisabled = true;

        const list = [...this.dataSource.data];
        moveItemInArray(list, event.previousIndex, event.currentIndex);
        this.dataSource.data = list;

        const newOrders: ExamOrders = { orders: {} };
        list.forEach((item, index) => (newOrders.orders[item.id] = index + 1));

        this.subscriptions.push(
            this.examService.reorderExams(this.course.id, newOrders).subscribe({
                error: (error) => {
                    if (error instanceof HttpErrorResponse) {
                        const message = error.error?.message ?? 'خطا در بروزرسانی ترتیب آزمون‌ها';
                        this.snackBar.open(message, undefined, {
                            duration: 3000,
                            verticalPosition: 'bottom',
                            horizontalPosition: 'center',
                            panelClass: 'warn-snackbar',
                        });
                    }

                    this.loadData();
                },
            })
        );
    }
}

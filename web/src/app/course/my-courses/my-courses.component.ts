import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { CreateCourseDialogComponent } from '../create-course-dialog/create-course-dialog.component';
import { DeleteCourseDialogComponent } from '../delete-course-dialog/delete-course-dialog.component';
import { EditCourseDialogComponent } from '../edit-course-dialog/edit-course-dialog.component';
import { CourseInfo } from '../models/course-info';
import { CourseService } from '../services/course.service';

@Component({
    selector: 'app-my-courses',
    templateUrl: './my-courses.component.html',
    styleUrls: ['./my-courses.component.scss'],
})
export class MyCoursesComponent implements OnInit, AfterViewInit, OnDestroy {
    public attendedDisplayedColumns: (keyof CourseInfo)[] = ['name', 'creatorName', 'creationDate'];
    public createdDisplayedColumns: (keyof CourseInfo | 'actions')[] = ['name', 'creationDate', 'actions'];
    public attendedDataSource: MatTableDataSource<CourseInfo> = new MatTableDataSource<CourseInfo>();
    public createdDataSource: MatTableDataSource<CourseInfo> = new MatTableDataSource<CourseInfo>();
    public loading: boolean = true;

    @ViewChild('attendedPaginator')
    public attendedPaginator?: MatPaginator;

    @ViewChild('createdPaginator')
    public createdPaginator?: MatPaginator;

    @ViewChild('attendedSort')
    public attendedSort?: MatSort;

    @ViewChild('createdSort')
    public createdSort?: MatSort;

    public dateTimeOptions: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    };

    private subscriptions: Subscription[] = [];

    constructor(public courseService: CourseService, public dialog: MatDialog) {}

    ngOnInit(): void {
        this.loadData();
        this.attendedDataSource.filterPredicate = (data, filter) => this.filterPredicate(data, filter);
        this.createdDataSource.filterPredicate = (data, filter) => this.filterPredicate(data, filter, false);
    }

    ngAfterViewInit() {
        this.attendedDataSource.paginator = this.attendedPaginator ?? null;
        this.attendedDataSource.sort = this.attendedSort ?? null;

        this.createdDataSource.paginator = this.createdPaginator ?? null;
        this.createdDataSource.sort = this.createdSort ?? null;
    }

    ngOnDestroy(): void {
        for (const subscription of this.subscriptions) subscription.unsubscribe();
    }

    private loadData() {
        this.subscriptions.push(
            this.courseService.getAttendedCourses().subscribe((courses) => {
                this.attendedDataSource.data = courses;
                this.loading = false;
            }),
            this.courseService.getCreatedCourses().subscribe((courses) => {
                this.createdDataSource.data = courses;
                this.loading = false;
            })
        );
    }

    public applyFilter(filterValue: string) {
        this.attendedDataSource.filter = filterValue.trim().toLowerCase();
        if (this.attendedDataSource.paginator) {
            this.attendedDataSource.paginator.firstPage();
        }

        this.createdDataSource.filter = filterValue.trim().toLowerCase();
        if (this.createdDataSource.paginator) {
            this.createdDataSource.paginator.firstPage();
        }
    }

    public createCourse() {
        const dialogRef = this.dialog.open(CreateCourseDialogComponent);

        dialogRef.afterClosed().subscribe((result: boolean) => {
            if (result) this.loadData();
        });
    }

    public editCourse(course: CourseInfo) {
        const dialogRef = this.dialog.open(EditCourseDialogComponent, {
            data: course,
        });

        dialogRef.afterClosed().subscribe((result: boolean) => {
            if (result) this.loadData();
        });
    }

    public deleteCourse(course: CourseInfo) {
        const dialogRef = this.dialog.open(DeleteCourseDialogComponent, {
            data: course,
        });

        dialogRef.afterClosed().subscribe((result: boolean) => {
            if (result) this.loadData();
        });
    }

    private filterPredicate(data: CourseInfo, filter: string, includeCreatorName: boolean = true): boolean {
        return (
            data.name.includes(filter) ||
            data.description.includes(filter) ||
            (includeCreatorName && data.creatorName.includes(filter)) ||
            data.creationDate.toLocaleDateString('fa-Ir', this.dateTimeOptions).includes(filter)
        );
    }
}

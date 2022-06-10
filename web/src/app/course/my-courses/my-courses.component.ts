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
    public displayedColumns: (keyof CourseInfo | 'actions')[] = ['name', 'creationDate', 'actions'];
    public dataSource: MatTableDataSource<CourseInfo> = new MatTableDataSource<CourseInfo>();
    public loading: boolean = true;

    @ViewChild('paginator')
    public paginator?: MatPaginator;

    @ViewChild('sort')
    public sort?: MatSort;

    public dateTimeOptions: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    };

    private subscriptions: Subscription[] = [];

    constructor(public courseService: CourseService, public dialog: MatDialog) {}

    ngOnInit(): void {
        this.loadData();
        this.dataSource.filterPredicate = (data, filter) => this.filterPredicate(data, filter);
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator ?? null;
        this.dataSource.sort = this.sort ?? null;
    }

    ngOnDestroy(): void {
        for (const subscription of this.subscriptions) subscription.unsubscribe();
    }

    private loadData() {
        this.subscriptions.push(
            this.courseService.getCreatedCourses().subscribe((courses) => {
                this.dataSource.data = courses;
                this.loading = false;
            })
        );
    }

    public applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
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

    private filterPredicate(data: CourseInfo, filter: string): boolean {
        return (
            data.name.includes(filter) ||
            data.description.includes(filter) ||
            data.creatorName.includes(filter) ||
            data.creationDate.toLocaleDateString('fa-Ir', this.dateTimeOptions).includes(filter)
        );
    }
}

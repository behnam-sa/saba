import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { CourseInfo } from '../models/course-info';
import { CourseService } from '../services/course.service';

@Component({
    selector: 'app-course-list',
    templateUrl: './course-list.component.html',
    styleUrls: ['./course-list.component.scss'],
})
export class CourseListComponent implements OnInit, AfterViewInit, OnDestroy {
    public displayedColumns: (keyof CourseInfo)[] = ['name', 'creatorName', 'creationDate'];
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

    constructor(public courseService: CourseService) {}

    ngOnInit(): void {
        this.subscriptions.push(
            this.courseService.getCourses().subscribe((courses) => {
                this.dataSource.data = courses;
                this.loading = false;
            })
        );

        this.dataSource.filterPredicate = (data, filter) => this.filterPredicate(data, filter);
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator ?? null;
        this.dataSource.sort = this.sort ?? null;
    }

    ngOnDestroy(): void {
        for (const subscription of this.subscriptions) subscription.unsubscribe();
    }

    public applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
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

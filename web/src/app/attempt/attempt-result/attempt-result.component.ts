import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AlphabeticalNumberingService } from 'src/app/services/alphabetical-numbering';
import { AttemptDetails } from '../models/attempt-details';
import { AttemptStatus, attemptStatusPath } from '../models/attempt-status';
import { AttemptService } from '../services/attempt.service';

@Component({
    selector: 'app-attempt-result',
    templateUrl: './attempt-result.component.html',
    styleUrls: ['./attempt-result.component.scss'],
})
export class AttemptResultComponent implements OnInit, OnDestroy {
    private courseId?: number;
    private examId?: number;
    public attempt?: AttemptDetails;
    public loading: boolean = true;
    public currectQuestionIndex = 0;

    private subscriptions: Subscription[] = [];

    constructor(
        private attemptService: AttemptService,
        private route: ActivatedRoute,
        private router: Router,
        public alphabeticalNumbering: AlphabeticalNumberingService
    ) {}

    ngOnInit(): void {
        this.subscriptions.push(
            this.route.paramMap.subscribe((params) => {
                this.courseId = parseInt(params.get('courseId')!);
                this.examId = parseInt(params.get('examId')!);

                this.loadData(this.courseId, this.examId);
            })
        );
    }

    ngOnDestroy(): void {
        for (const subscription of this.subscriptions) subscription.unsubscribe();
    }

    private loadData(courseId: number, examId: number) {
        this.attemptService.getAttempt(courseId, examId).subscribe({
            next: (attempt) => {
                this.attempt = attempt;
                this.loading = false;
                if (attempt.attemptStatus !== AttemptStatus.inProgress) {
                    this.router.navigate(['..', attemptStatusPath[attempt.attemptStatus]], { relativeTo: this.route });
                }
            },
            error: () => {
                this.loading = false;
            },
        });
    }

    public identify(index: number, item: { id: number }) {
        return item.id;
    }
}

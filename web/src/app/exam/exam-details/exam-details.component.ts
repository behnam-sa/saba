import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ExamDetails } from '../models/exam-details';
import { OptionInfo } from '../models/option-info';
import { QuestionInfo } from '../models/question-info';
import { QuestionOrders } from '../models/question-orders';
import { ExamService } from '../services/exam.service';
import { OptionService } from '../services/option.service';
import { QuestionService } from '../services/question.service';

@Component({
    selector: 'app-exam-details',
    templateUrl: './exam-details.component.html',
    styleUrls: ['./exam-details.component.scss'],
})
export class ExamDetailsComponent implements OnInit, OnDestroy {
    private courseId?: number;
    public exam?: ExamDetails;
    public loading: boolean = true;

    private subscriptions: Subscription[] = [];

    constructor(
        private examService: ExamService,
        private questionService: QuestionService,
        private optionService: OptionService,
        private route: ActivatedRoute,
        private snackBar: MatSnackBar
    ) {}

    ngOnInit(): void {
        this.subscriptions.push(
            this.route.paramMap.subscribe((params) => {
                this.courseId = parseInt(params.get('courseId')!);
                const examId = parseInt(params.get('examId')!);

                this.loadData(this.courseId, examId);
            })
        );
    }

    ngOnDestroy(): void {
        for (const subscription of this.subscriptions) subscription.unsubscribe();
    }

    private loadData(courseId: number, examId: number) {
        this.examService.getExam(courseId, examId).subscribe({
            next: (exam) => {
                this.exam = exam;
                this.loading = false;
            },
            error: () => {
                this.loading = false;
            },
        });
    }

    public addQuestion() {
        this.questionService.createQuestion(this.courseId!, this.exam!.id, { text: '' }).subscribe({
            next: (newQuestion) => {
                this.exam!.questions.unshift(newQuestion);

                this.updateQuestionOrders();
            },
            error: (error) => {
                if (error instanceof HttpErrorResponse) {
                    const message = error.error?.message ?? 'خطا در ایجاد پرسش جدید';
                    this.showError(message);
                }

                this.loadData(this.courseId!, this.exam!.id);
            },
        });
    }

    public editQuestion(question: QuestionInfo, event: Event) {
        const newValue = (event.target as HTMLInputElement).value;
        question.text = newValue;

        this.questionService.editQuestion(this.courseId!, this.exam!.id, question.id, { text: newValue }).subscribe({
            error: (error) => {
                if (error instanceof HttpErrorResponse) {
                    const message = error.error?.message ?? 'خطا در ویرایش پرسش';
                    this.showError(message);
                }

                this.loadData(this.courseId!, this.exam!.id);
            },
        });
    }

    public deleteQuestion(question: QuestionInfo) {
        this.exam!.questions = this.exam!.questions.filter((q) => q.id !== question.id);

        this.questionService.deleteQuestion(this.courseId!, this.exam!.id, question.id).subscribe({
            error: (error) => {
                if (error instanceof HttpErrorResponse) {
                    const message = error.error?.message ?? 'خطا در حذف پرسش';
                    this.showError(message);
                }

                this.loadData(this.courseId!, this.exam!.id);
            },
        });
    }

    public dropQuestion(event: CdkDragDrop<void>) {
        const list = [...this.exam!.questions];
        moveItemInArray(list, event.previousIndex, event.currentIndex);
        this.exam!.questions = list;

        this.updateQuestionOrders();
    }

    private updateQuestionOrders() {
        const newOrders: QuestionOrders = { orders: {} };
        this.exam!.questions.forEach((item, index) => (newOrders.orders[item.id] = index + 1));

        this.subscriptions.push(
            this.questionService.reorderQuestions(this.courseId!, this.exam!.id, newOrders).subscribe({
                error: (error) => {
                    if (error instanceof HttpErrorResponse) {
                        const message = error.error?.message ?? 'خطا در بروزرسانی ترتیب پرسش‌ها';
                        this.showError(message);
                    }

                    this.loadData(this.courseId!, this.exam!.id);
                },
            })
        );
    }

    public addOption(question: QuestionInfo) {
        this.optionService.createOption(this.courseId!, this.exam!.id, question.id, { text: '' }).subscribe({
            next: (newOption) => {
                question.options.push(newOption);
            },
            error: (error) => {
                if (error instanceof HttpErrorResponse) {
                    const message = error.error?.message ?? 'خطا در ایجاد پرسش جدید';
                    this.showError(message);
                }

                this.loadData(this.courseId!, this.exam!.id);
            },
        });
    }

    public editOption(question: QuestionInfo, option: OptionInfo, event: Event) {
        const newValue = (event.target as HTMLInputElement).value;
        option.text = newValue;

        this.optionService
            .editOption(this.courseId!, this.exam!.id, question.id, option.id, { text: newValue })
            .subscribe({
                error: (error) => {
                    if (error instanceof HttpErrorResponse) {
                        const message = error.error?.message ?? 'خطا در ویرایش گزینه';
                        this.showError(message);
                    }

                    this.loadData(this.courseId!, this.exam!.id);
                },
            });
    }

    public deleteOption(question: QuestionInfo, option: OptionInfo) {
        question.options = question.options.filter((o) => o.id !== option.id);

        this.optionService.deleteOption(this.courseId!, this.exam!.id, question.id, option.id).subscribe({
            error: (error) => {
                if (error instanceof HttpErrorResponse) {
                    const message = error.error?.message ?? 'خطا در حذف گزینه';
                    this.showError(message);
                }

                this.loadData(this.courseId!, this.exam!.id);
            },
        });
    }

    public dropOption(question: QuestionInfo, event: CdkDragDrop<void>) {
        const list = [...question.options];
        moveItemInArray(list, event.previousIndex, event.currentIndex);
        question.options = list;

        this.updateOptionOrders(question);
    }

    private updateOptionOrders(question: QuestionInfo) {
        const newOrders: QuestionOrders = { orders: {} };
        question.options.forEach((item, index) => (newOrders.orders[item.id] = index + 1));

        this.subscriptions.push(
            this.optionService.reorderOptions(this.courseId!, this.exam!.id, question.id, newOrders).subscribe({
                error: (error) => {
                    if (error instanceof HttpErrorResponse) {
                        const message = error.error?.message ?? 'خطا در بروزرسانی ترتیب گزینه‌ها';
                        this.showError(message);
                    }

                    this.loadData(this.courseId!, this.exam!.id);
                },
            })
        );
    }

    private showError(message: any) {
        this.snackBar.open(message, undefined, {
            duration: 3000,
            verticalPosition: 'bottom',
            horizontalPosition: 'center',
            panelClass: 'warn-snackbar',
        });
    }

    public identify(index: number, item: { id: number }) {
        return item.id;
    }
}

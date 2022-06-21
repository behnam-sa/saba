import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { ExamDetails } from '../models/exam-details';
import { ExamInfo } from '../models/exam-info';
import { ExamInfoCreate } from '../models/exam-info-create';
import { ExamInfoEdit } from '../models/exam-info-edit';
import { ExamOrders } from '../models/exam-orders';

@Injectable()
export class ExamService {
    constructor(private api: ApiService) {}

    public getExams(courseId: number): Observable<ExamInfo[]> {
        return this.api.get<ExamInfo[]>(`course/${courseId}/exam`).pipe(
            map((exams) =>
                exams.map((exam) => ({
                    id: exam.id,
                    name: exam.name,
                    creationDate: new Date(exam.creationDate),
                    attemptStatus: exam.attemptStatus,
                }))
            )
        );
    }

    public getExam(courseId: number, id: number): Observable<ExamDetails> {
        return this.api.get<ExamDetails>(`course/${courseId}/exam/${id}`).pipe(
            map((exam) => ({
                id: exam.id,
                name: exam.name,
                creationDate: new Date(exam.creationDate),
                questions: exam.questions,
            }))
        );
    }

    public createExam(courseId: number, exam: ExamInfoCreate): Observable<void> {
        return this.api.post(`course/${courseId}/exam`, exam);
    }

    public editExam(courseId: number, id: number, exam: ExamInfoEdit): Observable<void> {
        return this.api.put(`course/${courseId}/exam/${id}`, exam);
    }

    public deleteExam(courseId: number, id: number): Observable<void> {
        return this.api.delete(`course/${courseId}/exam/${id}`);
    }

    public reorderExams(courseId: number, orders: ExamOrders): Observable<void> {
        return this.api.post(`course/${courseId}/exam/reorder`, orders);
    }
}

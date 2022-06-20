import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { QuestionInfo } from '../models/question-info';
import { QuestionInfoCreate } from '../models/question-info-create';
import { QuestionInfoEdit } from '../models/question-info-edit';
import { QuestionOrders } from '../models/question-orders';

@Injectable()
export class QuestionService {
    constructor(private api: ApiService) {}

    public createQuestion(courseId: number, examId: number, question: QuestionInfoCreate): Observable<QuestionInfo> {
        return this.api.post(`course/${courseId}/exam/${examId}/question`, question);
    }

    public editQuestion(courseId: number, examId: number, id: number, question: QuestionInfoEdit): Observable<void> {
        return this.api.put(`course/${courseId}/exam/${examId}/question/${id}`, question);
    }

    public deleteQuestion(courseId: number, examId: number, id: number): Observable<void> {
        return this.api.delete(`course/${courseId}/exam/${examId}/question/${id}`);
    }

    public reorderQuestions(courseId: number, examId: number, orders: QuestionOrders): Observable<void> {
        return this.api.post(`course/${courseId}/exam/${examId}/question/reorder`, orders);
    }
}

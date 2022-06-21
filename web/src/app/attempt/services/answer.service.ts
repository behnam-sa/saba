import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';

@Injectable()
export class AnswerService {
    constructor(private api: ApiService) {}

    public putAnswer(courseId: number, examId: number, questionId: number, selectedOption: number): Observable<void> {
        return this.api.put<void>(
            `course/${courseId}/exam/${examId}/attempt/question/${questionId}/answer`,
            selectedOption
        );
    }

    public deleteAnswer(courseId: number, examId: number, questionId: number): Observable<void> {
        return this.api.delete<void>(`course/${courseId}/exam/${examId}/attempt/question/${questionId}/answer`);
    }
}

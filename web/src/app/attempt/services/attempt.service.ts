import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { AttemptDetails } from '../models/attempt-details';

@Injectable()
export class AttemptService {
    constructor(private api: ApiService) {}

    public getAttempt(courseId: number, examId: number): Observable<AttemptDetails> {
        return this.api.get<AttemptDetails>(`course/${courseId}/exam/${examId}/attempt`).pipe(
            map((attempt) => ({
                id: attempt.id,
                name: attempt.name,
                creationDate: new Date(attempt.creationDate),
                attemptStatus: attempt.attemptStatus,
                answers: attempt.answers,
            }))
        );
    }

    public beginAttempt(courseId: number, examId: number): Observable<void> {
        return this.api.post<void>(`course/${courseId}/exam/${examId}/attempt/begin`);
    }

    public finishAttempt(courseId: number, examId: number): Observable<void> {
        return this.api.post<void>(`course/${courseId}/exam/${examId}/attempt/finish`);
    }
}

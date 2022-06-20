import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { OptionInfo } from '../models/option-info';
import { OptionInfoCreate } from '../models/option-info-create';
import { OptionInfoEdit } from '../models/option-info-edit';
import { OptionOrders } from '../models/option-orders';

@Injectable()
export class OptionService {
    constructor(private api: ApiService) {}

    public createOption(
        courseId: number,
        examId: number,
        questionId: number,
        option: OptionInfoCreate
    ): Observable<OptionInfo> {
        return this.api.post(`course/${courseId}/exam/${examId}/question/${questionId}/option`, option);
    }

    public editOption(
        courseId: number,
        examId: number,
        questionId: number,
        id: number,
        option: OptionInfoEdit
    ): Observable<void> {
        return this.api.put(`course/${courseId}/exam/${examId}/question/${questionId}/option/${id}`, option);
    }

    public deleteOption(courseId: number, examId: number, questionId: number, id: number): Observable<void> {
        return this.api.delete(`course/${courseId}/exam/${examId}/question/${questionId}/option/${id}`);
    }

    public reorderOptions(
        courseId: number,
        examId: number,
        questionId: number,
        orders: OptionOrders
    ): Observable<void> {
        return this.api.post(`course/${courseId}/exam/${examId}/question/${questionId}/option/reorder`, orders);
    }
}

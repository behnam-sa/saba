import { QuestionInfo } from 'src/app/exam/models/question-info';

export interface AttemptAnswer extends QuestionInfo {
    selectedOption: number | null;
}

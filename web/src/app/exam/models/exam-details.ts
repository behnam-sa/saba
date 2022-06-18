import { QuestionInfo } from './question-info';

export interface ExamDetails {
    id: number;
    name: string;
    creationDate: Date;
    questions: QuestionInfo[];
}

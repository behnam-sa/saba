import { ExamInfo } from 'src/app/exam/models/exam-info';
import { AttemptAnswer } from './attempt-answer';

export interface AttemptDetails extends ExamInfo {
    answers: AttemptAnswer[];
}

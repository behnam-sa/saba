import { AttemptStatus } from 'src/app/attempt/models/attempt-status';

export interface ExamInfo {
    id: number;
    name: string;
    creationDate: Date;
    attemptStatus: AttemptStatus;
}

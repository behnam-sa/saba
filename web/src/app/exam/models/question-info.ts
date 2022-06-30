import { OptionInfo } from './option-info';

export interface QuestionInfo {
    id: number;
    text: string;
    correctOption: number | null;
    options: OptionInfo[];
}

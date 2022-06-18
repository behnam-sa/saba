import { OptionInfo } from './option-info';

export interface QuestionInfo {
    id: number;
    text: string;
    options: OptionInfo[];
}

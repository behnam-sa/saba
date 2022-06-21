import { Injectable } from '@angular/core';

@Injectable()
export class AlphabeticalNumberingService {
    private numberingTexts = [
        'الف',
        'ب',
        'ج',
        'د',
        'ه',
        'و',
        'ز',
        'ح',
        'ط',
        'ی',
        'ک',
        'ل',
        'م',
        'ن',
        'س',
        'ع',
        'ف',
        'ص',
        'ق',
        'ر',
        'ش',
        'ت',
        'ث',
        'خ',
        'ذ',
        'ض',
        'ظ',
        'غ',
    ];

    public getText(index: number): string {
        if (index < this.numberingTexts.length) {
            return this.numberingTexts[index];
        }

        console.error(`Index >= ${this.numberingTexts.length} not supported`);
        return index.toLocaleString('fa-IR');
    }
}

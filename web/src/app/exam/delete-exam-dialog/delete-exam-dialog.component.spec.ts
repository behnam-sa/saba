import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteExamDialogComponent } from './delete-exam-dialog.component';

describe('DeleteExamDialogComponent', () => {
    let component: DeleteExamDialogComponent;
    let fixture: ComponentFixture<DeleteExamDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DeleteExamDialogComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DeleteExamDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

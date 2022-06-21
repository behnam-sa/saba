import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AlphabeticalNumberingService } from 'src/app/services/alphabetical-numbering';
import { AttemptService } from '../services/attempt.service';
import { AttemptResultComponent } from './attempt-result.component';

describe('AttemptResultComponent', () => {
    let component: AttemptResultComponent;
    let fixture: ComponentFixture<AttemptResultComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AttemptResultComponent],
            imports: [RouterTestingModule],
            providers: [AlphabeticalNumberingService, { provide: AttemptService, useValue: {} }],
        }).compileComponents();

        fixture = TestBed.createComponent(AttemptResultComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

import { DragDropModule } from '@angular/cdk/drag-drop';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { NgModule } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule, MAT_TOOLTIP_DEFAULT_OPTIONS } from '@angular/material/tooltip';
import { PaginatorIntl } from './services/paginator-intl.service';
import { tooltipDefaultOptions } from './services/tooltip-default-options';

const material = [
    MatSnackBarModule,
    MatSelectModule,
    MatFormFieldModule,
    MatTableModule,
    MatSidenavModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatListModule,
    MatDividerModule,
    MatInputModule,
    MatCardModule,
    MatExpansionModule,
    MatBadgeModule,
    ScrollingModule,
    DragDropModule,
    MatButtonToggleModule,
    MatRippleModule,
    MatDialogModule,
    MatCheckboxModule,
    MatSortModule,
    MatProgressBarModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatStepperModule,
];

@NgModule({
    imports: [material],
    providers: [
        { provide: MatPaginatorIntl, useClass: PaginatorIntl },
        { provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: tooltipDefaultOptions },
    ],
    exports: [material],
})
export class MaterialModule {}

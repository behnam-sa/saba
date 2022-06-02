import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../material/material.module';
import { HeaderComponent } from './header/header.component';
import { LayoutComponent } from './layout/layout.component';

@NgModule({
    declarations: [HeaderComponent, LayoutComponent],
    imports: [CommonModule, MaterialModule, RouterModule],
    exports: [LayoutComponent],
})
export class LayoutModule {}

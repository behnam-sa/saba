import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
import { AccountRoutingModule } from './account-routing.module';
import { AccountComponent } from './account.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { RegisterComponent } from './register/register.component';
import { AccountService } from './services/account.service';

@NgModule({
    declarations: [AccountComponent, LoginComponent, RegisterComponent, ProfileComponent],
    imports: [CommonModule, ReactiveFormsModule, MaterialModule, AccountRoutingModule],
    providers: [AccountService],
})
export class AccountModule {}

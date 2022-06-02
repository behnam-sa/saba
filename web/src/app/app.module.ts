import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Observable } from 'rxjs';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthenticationModule } from './authentication/authentication.module';
import { LayoutModule } from './layout/layout.module';
import { MaterialModule } from './material/material.module';
import { ApiService } from './services/api.service';
import { ConfigService } from './services/config.service';

function initializeAppFactory(appConfigService: ConfigService): () => Observable<any> {
    return () => appConfigService.loadConfig();
}

@NgModule({
    declarations: [AppComponent],
    imports: [
        AppRoutingModule,
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        AuthenticationModule,
        MaterialModule,
        LayoutModule,
    ],
    providers: [
        ApiService,
        ConfigService,
        {
            provide: APP_INITIALIZER,
            multi: true,
            deps: [ConfigService],
            useFactory: initializeAppFactory,
        },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

@Injectable()
export class ConfigService {
    private configItems?: any;

    constructor(private http: HttpClient) {}

    public loadConfig(): Observable<any> {
        return this.http.get('/assets/config.json').pipe(
            tap((data) => {
                this.configItems = data;
            })
        );
    }

    private get config(): any {
        if (!this.configItems) {
            throw new Error('Config file not loaded!');
        }

        return this.configItems;
    }

    private getItem(name: string): any {
        if (!this.config[name] === undefined) {
            throw new Error(`Config item "${name}" was not found in config!`);
        }

        return this.config[name];
    }

    public get apiBaseUrl(): string {
        return this.getItem('apiBaseUrl');
    }
}

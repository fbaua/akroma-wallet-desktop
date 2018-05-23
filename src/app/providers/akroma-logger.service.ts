import { Injectable, OnInit } from '@angular/core';
import { ElectronService } from './electron.service';
import { SettingsPersistenceService } from './settings-persistence.service';

@Injectable()
export class AkromaLoggerService implements OnInit {

    settings: any;
    async ngOnInit() {
        this.settings = await this.settingsService.db.get('system');
    }

    constructor(
        private electronService: ElectronService,
        private settingsService: SettingsPersistenceService,
    ) {
    }
    debug(message: string) {
        // tslint:disable-next-line:no-console
        const formatted = this.format(message, new Date(), 'debug');
        console.log(formatted);
    }

    info(message: string) {
        const formatted = this.format(message, new Date(), 'info');
        // tslint:disable-next-line:no-console
        console.info(formatted);
    }

    warn(message: string) {
        const formatted = this.format(message, new Date(), 'warn');
        console.warn(formatted);
    }

    error(message: string) {
        const formatted = this.format(message, new Date(), 'error');
        console.error(formatted);
    }

    format(message: string, date: Date, level: string) {
        return '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}] {text}'
            .replace('{level}', level)
            .replace('{text}', message)
            .replace('{y}', date.getFullYear().toString())
            .replace('{m}', this.pad(date.getMonth() + 1))
            .replace('{d}', this.pad(date.getDate()))
            .replace('{h}', this.pad(date.getHours()))
            .replace('{i}', this.pad(date.getMinutes()))
            .replace('{s}', this.pad(date.getSeconds()))
            .replace('{ms}', this.pad(date.getMilliseconds(), 3))
            .replace('{z}', this.formatTimeZone(date.getTimezoneOffset()));
    }

    pad(number, zeros = 2) {
        zeros = zeros || 2;
        return (new Array(zeros + 1).join('0') + number).substr(-zeros, zeros);
    }

    formatTimeZone(minutesOffset) {
        const m = Math.abs(minutesOffset);
        return (minutesOffset >= 0 ? '-' : '+') +
            this.pad(Math.floor(m / 60)) + ':' +
            this.pad(m % 60);
    }
}

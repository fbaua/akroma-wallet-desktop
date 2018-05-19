import { Component } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { AppConfig } from './app.config';
import { ElectronService } from './providers/electron.service';
import { AkromaClientService } from './providers/akroma-client.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(public electronService: ElectronService,
    private translate: TranslateService,
    private akromaClientService: AkromaClientService) {

    translate.setDefaultLang('en');
    console.log('AppConfig', AppConfig);

    if (electronService.isElectron()) {
      console.log('Mode electron');
      console.log('Electron ipcRenderer', electronService.ipcRenderer);
      console.log('NodeJS childProcess', electronService.childProcess);
      console.log('NodeJS os', electronService.os);
      this.akromaClientService.initialize(res => {
        this.akromaClientService.downloadClient(success => {
          console.log('status', status);
          if (success) {
            this.akromaClientService.startClient();
          }
        });
      });
    } else {
      console.log('Mode web');
    }
  }
}

import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { SystemSettings } from '../../models/system-settings';
import { ElectronService } from '../../providers/electron.service';
import { SettingsPersistenceService } from '../../providers/settings-persistence.service';
import { Web3Service } from '../../providers/web3.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  blockNumber$: Observable<number>;
  listening$: Observable<boolean>;
  peerCount$: Observable<number>;
  private settings: SystemSettings;

  constructor(
    private web3: Web3Service,
    private electronService: ElectronService,
    private settingsService: SettingsPersistenceService
  ) { }

  async ngOnInit() {
    this.settings = await this.settingsService.db.get('system');
    setInterval(() => {
      this.blockNumber$ = Observable.fromPromise(this.web3.eth.getBlockNumber());
      this.listening$ = Observable.fromPromise(this.web3.eth.net.isListening());
      this.peerCount$ = Observable.fromPromise(this.web3.eth.net.getPeerCount());
    }, 5000);
  }

  viewLogs() {
    console.log('test');
    this.electronService.remote.shell.showItemInFolder(this.settings.applicationPath + this.electronService.path.sep + 'akroma.txt');
  }
}

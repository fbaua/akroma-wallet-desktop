import { Component, OnInit } from '@angular/core';
import { SystemSettings } from '../../models/system-settings';
import { ElectronService } from '../../providers/electron.service';
import { SettingsPersistenceService } from '../../providers/settings-persistence.service';
import { AkromaClientService } from '../../providers/akroma-client.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  private settings: SystemSettings;

  constructor(
    private clientService: AkromaClientService,
    private electronService: ElectronService,
    private settingsService: SettingsPersistenceService
  ) { }

  async ngOnInit() {
    try {
      this.settings = await this.settingsService.db.get('system');
    } catch {
      this.settings = await this.clientService.defaultSettings();
    }
  }

  viewLogs() {
    console.log('test');
    this.electronService.remote.shell.showItemInFolder(this.settings.applicationPath + this.electronService.path.sep + 'akroma.txt');
  }
}

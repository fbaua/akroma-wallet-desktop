import { Component, OnInit } from '@angular/core';
import { SystemSettings } from '../../models/system-settings';
import { ElectronService } from '../../providers/electron.service';
import { SettingsPersistenceService } from '../../providers/settings-persistence.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  private settings: SystemSettings;

  constructor(
    private electronService: ElectronService,
    private settingsService: SettingsPersistenceService
  ) { }

  async ngOnInit() {
    this.settings = await this.settingsService.db.get('system');
  }

  viewLogs() {
    console.log('test');
    this.electronService.remote.shell.showItemInFolder(this.settings.applicationPath + this.electronService.path.sep + 'akroma.txt');
  }
}

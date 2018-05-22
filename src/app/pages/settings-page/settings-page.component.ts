import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { SystemSettings } from '../../models/system-settings';
import { SettingsPersistenceService } from '../../providers/settings-persistence.service';


@Component({
  selector: 'app-settings-page',
  templateUrl: './settings-page.component.html',
  styleUrls: ['./settings-page.component.scss']
})
export class SettingsPageComponent implements OnInit {
  @ViewChild('directoryInput')
  private directoryInput: ElementRef;
  systemSettingsForm: FormGroup;
  storedSettings: SystemSettings;

  constructor(
    private settingsService: SettingsPersistenceService, 
    private fb: FormBuilder,
  private router: Router) {
    this.systemSettingsForm = this.fb.group({
      dataDirPath: '',
      syncMode: '',
      _id: 'system',
    });
  }

  async ngOnInit() {
    const storedSettings = await this.settingsService.db.get('system');
    if (!!storedSettings) {
      this.systemSettingsForm = this.fb.group(storedSettings);
    }
  }

  onDirectoryPathChange(event: any) {
    const files = event.srcElement.files;
    if (files.length > 0) {
      this.systemSettingsForm.get('dataDirPath').setValue(files['0'].path);
      this.systemSettingsForm.get('dataDirPath').markAsDirty();
    }
  }

  async onSubmit() {
    const result = await this.settingsService.db.put(this.systemSettingsForm.value);
    if (result.ok) {
      this.onRevert();
    }
  }

  async onRevert() {
      const systemSettings = await this.settingsService.db.get('system');
      this.systemSettingsForm = this.fb.group(systemSettings);
      this.directoryInput.nativeElement.value = '';
      this.router.navigate(['/wallets']);
  }
}

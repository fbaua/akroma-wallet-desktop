import { Injectable } from '@angular/core';

import PouchDB from 'pouchdb';

import { SystemSettings } from '../models/system-settings';

@Injectable()
export class SettingsPersistenceService {
  private _db: PouchDB.Database<SystemSettings>;

  get db(): PouchDB.Database<SystemSettings> {
    return this._db;
  }

  constructor() {
    this._db = new PouchDB('settings');
  }
}

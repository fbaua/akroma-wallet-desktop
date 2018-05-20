import { Injectable } from '@angular/core';

import * as PouchDB from 'pouchdb-browser';

import { Transaction } from 'web3/types';

@Injectable()
export class TransactionsPersistenceService {
  private _db: PouchDB.Database<Transaction>;

  get db(): PouchDB.Database<Transaction> {
    return this._db;
  }

  constructor() {
    this._db = new PouchDB('transactions');
  }
}

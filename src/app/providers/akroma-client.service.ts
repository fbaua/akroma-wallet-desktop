import { Injectable } from '@angular/core';
import { ChildProcess } from 'child_process';
import * as request from 'request';
import { clientConstants } from './akroma-client.constants';
import { ElectronService } from './electron.service';
import { SettingsPersistenceService } from './settings-persistence.service';
import { Web3Service } from './web3.service';
import { AkromaLoggerService } from './akroma-logger.service';



export const statusConstants = {
  DOWNLOADING: 'downloading',
  RUNNING: 'running',
  STOPPED: 'stopped',
  SYNCING: 'syncing',
  SYNCED: 'synced',
};

@Injectable()
export class AkromaClientService {
  private client: any; // TODO create model
  private clientPath: string;
  private clientBin: string;
  private syncMode: string;
  private _status: string;
  private _process: ChildProcess;
  get clientProcess(): ChildProcess {
    return this._process;
  }
  get status(): string {
    return this._status;
  }

  constructor(
    private logger: AkromaLoggerService,
    private es: ElectronService,
    private settingsService: SettingsPersistenceService,
    private web3: Web3Service) {
    this.web3.setProvider(new this.web3.providers.HttpProvider(clientConstants.connection.default));
  }

  async initialize(callback: Function) {
    let settings;
    try {
      this.client = clientConstants.clients.akroma.platforms[this.es.os.platform()][this.es.os.arch()];
      settings = await this.settingsService.db.get('system');
      await this.settingsService.db.remove(settings);
      settings = await this.defaultSettings();
    } catch {
      settings = await this.defaultSettings();
    }

    this.logger.info('[settings]: ' + JSON.stringify(settings));
    this.logger.info('[clientPath]: ' + settings.clientPath);
    this.logger.info('[clientBin]: ' + this.client.bin);
    this.clientPath = settings.clientPath;
    this.clientBin = this.client.bin;
    this.syncMode = settings.syncMode;
    callback();
  }

  async defaultSettings(): Promise<any> {
    this.logger.debug('loading default settings');
    const saveMe = {
      _id: 'system',
      clientPath: this.es.path.join(this.es.process.env.HOME + this.client.extract_path),
      applicationPath: this.es.remote.app.getPath('userData'),
      syncMode: 'fast',
    };

    const result = await this.settingsService.db.put(saveMe);
    if (result.ok) {
      this.logger.info('[saved settings]: ' + JSON.stringify(saveMe));
      return saveMe;
    }
  }

  downloadClient(callback?: Function): void {
    if (this.akromaClientExists()) {
      callback(true);
      return;
    }

    this._status = statusConstants.DOWNLOADING;
    const url = this.client.download.url;
    const req = request(url);

    // tslint:disable-next-line:no-console
    this.logger.debug('[Downloading Akroma client...]');
    if (this.es.fs.existsSync(this.clientPath) === false) {
      this.logger.debug('Client does not exist, making directory: ' + this.clientPath);
      this.es.fs.mkdirSync(this.clientPath);
    }

    req.on('response', (response) => {
      response.pipe(this.es.fs.createWriteStream(this.clientPath + this.es.path.sep + this.clientBin));
    });

    req.on('end', () => {
      if (this.es.os.platform().toString() !== 'win32') {
        this.es.fs.chmod(this.clientPath + this.es.path.sep + this.clientBin, this.es.fs.constants.S_IXUSR, err => {
          if (err) {
            callback(false, 'Akroma client could not be created as executable');
          }
          callback(true);
        });
      }
      callback(true);
    });
  }

  async startClient() {
    try {
      const isListening = await this.web3.eth.net.isListening();
      if (isListening) {
        this._status = statusConstants.RUNNING;
        return;
      }
    } catch {
      // tslint:disable-next-line:no-console
      this.logger.debug('[Starting Akroma client...]');
      const settings = await this.settingsService.db.get('system');
      const program = this.clientPath + this.es.path.sep + this.clientBin;
      const dataDir = this.clientPath + this.es.path.sep + 'data';

      this.logger.info('[program]: ' + program);
      this.logger.info('[dataDir]: ' + dataDir);
      const process = this.es.childProcess.spawn(program, [
        '--datadir', dataDir,
        '--syncmode', this.syncMode,
        '--cache', '1024',
        '--rpc',
        '--rpccorsdomain', '*',
        '--rpcport', '8545',
        '--rpcapi', 'eth,web3,admin,net,personal,db',
      ]);
      this._process = process;
      this._status = statusConstants.RUNNING;
      return process;
    }
  }

  stopClient() {
    // tslint:disable-next-line:no-console
    this.logger.debug('[Stopping Akroma client...]');
    this._process.kill();
    this._status = statusConstants.STOPPED;
    return true;
  }

  private archiveVerifiedMd5Checksum(fileBuffer: Buffer): boolean {
    return this.es.crypto.createHash('md5').update(fileBuffer).digest('hex') === this.client.download.md5;
  }

  private akromaClientExists(): boolean {
    return this.es.fs.existsSync(this.clientPath + this.es.path.sep + this.clientBin);
  }
}

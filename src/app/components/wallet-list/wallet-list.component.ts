import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/of';
import { IntervalObservable } from 'rxjs/observable/IntervalObservable';
import { distinctUntilChanged, mergeMap, retry } from 'rxjs/operators';
import { Wallet } from '../../models/wallet';
import { clientConstants } from '../../providers/akroma-client.constants';
import { ElectronService } from '../../providers/electron.service';
import { SettingsPersistenceService } from '../../providers/settings-persistence.service';
import { WalletPersistenceService } from '../../providers/wallet-persistence.service';
import { Web3Service } from '../../providers/web3.service';

const electron = window.require('electron')




@Component({
  selector: 'app-wallet-list',
  templateUrl: './wallet-list.component.html',
  styleUrls: ['./wallet-list.component.scss']
})
export class WalletListComponent implements OnInit {
  modalRef: BsModalRef;
  allWalletsBalance: number;
  walletForm: FormGroup;
  wallets: Wallet[];

  constructor(private formBuilder: FormBuilder,
              private modalService: BsModalService,
              private web3: Web3Service,
              private walletService: WalletPersistenceService,
              private settingsService: SettingsPersistenceService,
              private electronService: ElectronService) {
    this.web3.setProvider(new this.web3.providers.HttpProvider(clientConstants.connection.default));
    this.wallets = [];
    this.walletForm = this.formBuilder.group(
      { name: '', passphrase: '', confirmPassphrase: '' },
      { validator: this.passphraseMatchValidator },
    );
  }

  async ngOnInit() {
    const subscription = IntervalObservable.create(5000)
    .pipe(mergeMap((i) => Observable.fromPromise(this.web3.eth.personal.getAccounts())))
    .pipe(retry(10))
    .pipe(distinctUntilChanged())
    .subscribe(async (wallets: string[]) => {
      const allPersistedWallets = await this.walletService.db.allDocs({ include_docs: true });
      wallets.forEach(wallet => {
        const storedWallet = allPersistedWallets.rows.find(x => x.doc.address === wallet);
        if (!!storedWallet) {
          this.wallets.push(storedWallet.doc);
          return;
        }

        this.wallets.push({
          name: 'Unnamed Wallet',
          address: wallet,
          _id: wallet,
        });
      });
      this.allWalletsBalance = await this.getWalletBalances(this.wallets.map(x => x.address));
      subscription.unsubscribe();
    });
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  passphraseMatchValidator(g: FormGroup) {
    return g.get('passphrase').value === g.get('confirmPassphrase').value
    ? null : {'passphraseMatch': true};
  }

  async createWallet(walletForm: FormGroup = this.walletForm) {
    const newWalletAddress = await this.web3.eth.personal.newAccount(walletForm.get('passphrase').value);
    const newWalletObject: Wallet = {
      _id: newWalletAddress,
      address: newWalletAddress,
      name: this.walletForm.get('name').value,
    };
    this.walletService.db.put(newWalletObject);
    this.wallets.push(await this.walletService.db.get(newWalletObject._id));
    this.modalRef.hide();
    this.walletForm.reset();
  }

  async deleteWallet(wallet: Wallet) {
    const systemSettings = await this.settingsService.db.get('system');
    const keystoreFileDir = `${systemSettings.dataDirPath}/.akroma/keystore`;
    const keystoreFileList = this.electronService.fs.readdirSync(keystoreFileDir);
    const keystoreFile = keystoreFileList.find(x => x.toLowerCase().includes(wallet.address.replace('0x', '').toLowerCase()));
    if (keystoreFile) {
      await this.electronService.fs.unlinkSync(`${keystoreFileDir}/${keystoreFile}`);
      const result = await this.walletService.db.remove(wallet._id, wallet._rev);
      if (result.ok) {
        this.wallets = this.wallets.filter(x => x._id !== wallet._id);
      }
      this.modalRef.hide();
    }
  }

  async getWalletBalances(addresses: string[]) {
    let totalBalance = 0;
    addresses.forEach(async x => {
      totalBalance += this.web3.utils.fromWei(await this.web3.eth.getBalance(x));
    });
    return totalBalance;
  }

  backupWalletReminder(wallet: Wallet, template: TemplateRef<any>) {
    this.openModal(template);
    this.modalRef.content = { wallet };
  }

  async backupWallet(wallet: Wallet) {
    const systemSettings = await this.settingsService.db.get('system');
    const keystoreFileDir = `${systemSettings.dataDirPath}/.akroma/keystore`;
    const keystoreFileList = await this.electronService.fs.readdirSync(keystoreFileDir);
    const keystoreFile = keystoreFileList.find(x => x.toLowerCase().includes(wallet.address.replace('0x', '').toLowerCase()));
    if (keystoreFile) {
      electron.shell.showItemInFolder(`${keystoreFileDir}/${keystoreFile}`);
    }
  }
}

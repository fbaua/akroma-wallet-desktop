import { Component, OnInit } from '@angular/core';
import { TransactionsService } from '../../providers/transactions.service';
import { Transaction } from 'web3/types';
import { Wallet } from '../../models/wallet';
import { ActivatedRoute } from '@angular/router';
import { TransactionsPersistenceService } from '../../providers/transactions-persistence.service';
import { ElectronService } from '../../providers/electron.service';
import { clientConstants } from '../../providers/akroma-client.constants';
const electron = window.require('electron');

@Component({
  selector: 'app-wallet-detail-page',
  templateUrl: './wallet-detail-page.component.html',
  styleUrls: ['./wallet-detail-page.component.scss']
})
export class WalletDetailPageComponent implements OnInit {
  transactions: Transaction[];
  wallet: Wallet;

  constructor(private electronService: ElectronService,
              private transactionsService: TransactionsService,
              private transactionsPersistenceService: TransactionsPersistenceService,
              private route: ActivatedRoute) {
    this.transactionsService.setProvider(new this.transactionsService.providers.HttpProvider(clientConstants.connection.default));
  }

  async ngOnInit() {
    const address = this.route.snapshot.params.address;
    this.wallet = {
      address: address,
      balance: await this.transactionsService.eth.getBalance(address),
      minedBlocks: 30343,
      transactions: 11281
    };
    const lastBlockSynced = this.getLastBlockSynced();
    this.startSyncBlocks(lastBlockSynced);
  }

  getLastBlockSynced(): number {
    return parseInt(localStorage.getItem(`lastBlock_${this.wallet.address}`), 10);
  }

  async startSyncBlocks(lastBlockSynced: number) {
    const endBlockNumber = await this.transactionsService.eth.getBlockNumber();
    const start = endBlockNumber - lastBlockSynced;
    for (let i = start; i < endBlockNumber; i++) {
      if (i % 100 === 0) {
        const transactions = await this.transactionsService.getTransactionsByAccount(this.wallet.address, i, i + 100);
        if (transactions.length > 1) {
          this.transactionsPersistenceService.db.bulkDocs(transactions);
          this.transactions.push( ...transactions );
        }
        localStorage.setItem(`lastBlock_${this.wallet.address}`, i.toString());
      }
    }
  }
}

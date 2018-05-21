import { Component, OnInit } from '@angular/core';
import { TransactionsService } from '../../providers/transactions.service';
import { Transaction } from 'web3/types';
import { Wallet } from '../../models/wallet';

@Component({
  selector: 'app-wallet-detail-page',
  templateUrl: './wallet-detail-page.component.html',
  styleUrls: ['./wallet-detail-page.component.scss']
})
export class WalletDetailPageComponent implements OnInit {
  transactions: Transaction[];
  wallet: Wallet;

  constructor(private transactionsService: TransactionsService) {
    this.transactionsService.setProvider(new this.transactionsService.providers.HttpProvider('http://localhost:8545'));
    this.wallet = {
      address: '0x33EeBd03625A23F5174f366b4823bD83542356D7',
      balance: 533.37122465,
      minedBlocks: 30343,
      transactions: 11281
    }
   }

  async ngOnInit() {
    this.transactions = await this.transactionsService.getTransactionsByAccount('*', null, null);
  }

}

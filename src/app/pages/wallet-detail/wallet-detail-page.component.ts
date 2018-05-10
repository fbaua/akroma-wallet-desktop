import { Component, OnInit } from '@angular/core';
import { TransactionsService } from '../../providers/transactions.service';
import { Transaction } from 'web3/types';

@Component({
  selector: 'app-wallet-detail-page',
  templateUrl: './wallet-detail-page.component.html',
  styleUrls: ['./wallet-detail-page.component.scss']
})
export class WalletDetailPageComponent implements OnInit {
  transactions: Transaction[];

  constructor(private transactionsService: TransactionsService) {
    this.transactionsService.setProvider(new this.transactionsService.providers.HttpProvider('http://localhost:8545'));
   }

  async ngOnInit() {
    this.transactions = await this.transactionsService.getTransactionsByAccount('*', null, null);
  }

}

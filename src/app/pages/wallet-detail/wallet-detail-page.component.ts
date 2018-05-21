import { Component, OnInit } from '@angular/core';
import { TransactionsService } from '../../providers/transactions.service';
import { Transaction } from 'web3/types';
import { Wallet } from '../../models/wallet';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-wallet-detail-page',
  templateUrl: './wallet-detail-page.component.html',
  styleUrls: ['./wallet-detail-page.component.scss']
})
export class WalletDetailPageComponent implements OnInit {
  transactions: Transaction[];
  wallet: Wallet;

  constructor(private transactionsService: TransactionsService,
              private route: ActivatedRoute) {
    this.transactionsService.setProvider(new this.transactionsService.providers.HttpProvider('http://localhost:8545'));
  }

  async ngOnInit() {
    const address = this.route.snapshot.params.address;
    this.transactions = await this.transactionsService.getTransactionsByAccount('*', null, null);
    this.wallet = {
      address: address,
      balance: await this.transactionsService.eth.getBalance(address),
      minedBlocks: 30343,
      transactions: 11281
    };
  }

}

import { Component, OnInit } from '@angular/core';
import { Transaction } from 'web3/types';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.scss']
})
export class TransactionListComponent implements OnInit {

  transaction: Transaction = {
    hash: '',
    nonce: 0,
    blockHash: '',
    blockNumber: 0,
    transactionIndex: 0,
    gasPrice: '',
    gas: 0,
    input: '',
    from: '0xa97c1FB74fb503405f4bf43F036E9CD7492919A16',
    to: '0xa97c1FB74fb503405f4bf43F036E9CD7492919A17',
    value: '0.1337'
  };

  constructor() { }

  ngOnInit() {
  }

}

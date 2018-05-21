import { Component, OnInit } from '@angular/core';
import { Transaction } from 'web3/types';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-send-transaction',
  templateUrl: './send-transaction.component.html',
  styleUrls: ['./send-transaction.component.scss']
})
export class SendTransactionComponent implements OnInit {
  transaction: Transaction;
  widthExp: number;
  amountSelected: boolean;

  sendForm = new FormGroup ({
    transactionValue: new FormControl(),
    transactionFrom: new FormControl(),
    transactionTo: new FormControl(),
  });

  constructor() {
    this.transaction = {
      hash: '',
      nonce: 0,
      blockHash: '',
      blockNumber: 0,
      transactionIndex: 0,
      from: '',
      to: '',
      value: '0.00',
      gasPrice: '20 Gwei',
      gas: 2100,
      input: '',
    };

    this.widthExp = 100;
    this.amountSelected = false;
  }

  ngOnInit() {
  }

}

import { Component, OnInit, Input } from '@angular/core';
import { Transaction } from 'web3/types';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.scss']
})
export class TransactionListComponent implements OnInit {
  @Input() transactions: Transaction[];


  timestamp: string = new Date().toLocaleDateString('en-GB', { timeZone: 'UTC' });

  constructor() { }

  ngOnInit() {
  }

}

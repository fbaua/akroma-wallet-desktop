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
  p: number = 1;
  filter: string = 'all';  

  constructor() { }

  ngOnInit() {
  }

  setFilter(filterType: string) {
    switch(filterType) {
      case 'all':
        this.filter = 'all';
        break;
      case 'sent':
        this.filter = 'sent';
        break;
      case 'received':
        this.filter = 'received';
        break;
    }
  }

}

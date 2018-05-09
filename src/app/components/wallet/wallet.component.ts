import { Component, OnInit } from '@angular/core';
import { Wallet } from '../../wallet';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss']
})
export class WalletComponent implements OnInit {
  wallet: Wallet = {
    address: '0x33EeBd03625A23F5174f366b4823bD83542356D7',
    balance: 533.37122465,
    minedBlocks: 30343,
    transactions: 11281
  }

  constructor() { }

  ngOnInit() {
  }

}

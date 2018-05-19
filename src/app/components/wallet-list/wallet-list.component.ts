import { Component, OnInit } from '@angular/core';
import { Web3Service } from '../../providers/web3.service';

@Component({
  selector: 'app-wallet-list',
  templateUrl: './wallet-list.component.html',
  styleUrls: ['./wallet-list.component.scss']
})
export class WalletListComponent implements OnInit {

  constructor(private web3: Web3Service) {
    this.web3.setProvider(new this.web3.providers.HttpProvider('http://localhost:8545'));
  }

  ngOnInit() {
  }

}

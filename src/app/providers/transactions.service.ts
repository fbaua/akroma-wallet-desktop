import { Injectable } from '@angular/core';

import { Transaction } from 'web3/types';

import { Web3Service } from './web3.service';

@Injectable()
export class TransactionsService extends Web3Service {

  async getTransactionsByAccount(myAccount: string, startBlockNumber: number, endBlockNumber: number): Promise<Transaction[]> {
    const accountTransactions: Transaction[] = [];
    if (endBlockNumber == null) {
      endBlockNumber = await this.eth.getBlockNumber();
    }
    if (startBlockNumber == null) {
      startBlockNumber = endBlockNumber - 1000;
    }

    for (let i = startBlockNumber; i <= endBlockNumber; i++) {
      const block = await this.eth.getBlock(i, true);
      if (block != null && block.transactions != null) {
        block.transactions.forEach((e: Transaction) => {
          if (myAccount === '*' || myAccount === e.from || myAccount === e.to) {
          accountTransactions.push(e);
          }
        });
      }
    }
    return accountTransactions;
  }

  private sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

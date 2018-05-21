import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { ProgressbarConfig } from 'ngx-bootstrap/progressbar';

import { ISubscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { IntervalObservable } from 'rxjs/observable/IntervalObservable';
import { distinctUntilChanged, mergeMap, retry } from 'rxjs/operators';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/of';

import { Web3Service } from '../../providers/web3.service';
import { AkromaClientService, statusConstants } from '../../providers/akroma-client.service';
import { clientConstants } from '../../providers/akroma-client.constants';

// such override allows to keep some initial values
export function getProgressbarConfig(): ProgressbarConfig {
  return Object.assign(new ProgressbarConfig(), { animate: true, striped: true,  max: 100});
}

@Component({
  selector: 'app-splash-page',
  templateUrl: './splash-page.component.html',
  styleUrls: ['./splash-page.component.scss'],
  providers: [{ provide: ProgressbarConfig, useFactory: getProgressbarConfig }]
})
export class SplashComponent implements OnDestroy, OnInit {
  clientStatus: string;
  lastPercentageSynced: number;
  isSyncing: boolean | any;
  isListening: boolean;
  peerCount: number;
  clientStatusSubscription: ISubscription;
  isListeningSubscription: ISubscription;
  isSyncingSubscription: ISubscription;
  peerCountSubscription: ISubscription;

  constructor(private web3: Web3Service,
              private router: Router,
              private clientService: AkromaClientService) {
    this.web3.setProvider(new this.web3.providers.HttpProvider(clientConstants.connection.default));
    this.lastPercentageSynced = 0;
    this.clientStatus = '';
  }

  ngOnInit() {
    this.clientStatusSubscription = IntervalObservable.create(1000)
    .pipe(mergeMap((i) => Observable.of(this.clientService.status)))
    .pipe(distinctUntilChanged())
    .subscribe((status: string) => {
      this.clientStatus = status;
      if (status === statusConstants.DOWNLOADING) {
        return;
      }
      if (status === statusConstants.RUNNING) {
        this.startSyncingSubscriptions();
        this.clientStatusSubscription.unsubscribe();
      }
    });
  }

  private startSyncingSubscriptions(): void {
    this.isListeningSubscription = IntervalObservable.create(2000)
    .pipe(mergeMap((i) => Observable.fromPromise(this.web3.eth.net.isListening())))
    .pipe(retry(10))
    .subscribe((result: boolean) => {
      console.log('is listening:' + result);
      this.isListening = result;
    });

    this.isSyncingSubscription = IntervalObservable.create(1000)
    .pipe(mergeMap((i) => Observable.fromPromise(this.web3.eth.isSyncing())))
    .pipe(retry(10))
    .subscribe((result: boolean | any) => {
      console.log('is syncing:' + JSON.stringify(result));
      if (this.isListening) {
        this.isSyncing = result;
        if (!!result) {
          console.log('currentBlock:' + result.currentBlock + ' highestBlock:' + result.highestBlock);
          this.lastPercentageSynced = this.currentPercentage(result.currentBlock, result.highestBlock);
        }
        if (!!result === false && (this.lastPercentageSynced || 0).toFixed(0) === '100') {
          // Nav away here
          console.log('nav away...');
          // If user has not set up a wallet yet, send them to create / import wallet
          // ...else send them to their last used wallet?
          this.router.navigate(['/wallet/1']);
        }
      }
    });

    this.peerCountSubscription = IntervalObservable.create(15000)
    .pipe(mergeMap((i) => Observable.fromPromise(this.web3.eth.net.getPeerCount())))
    .pipe(retry(10))
    .subscribe((result: number) => {
      if (this.isListening) {
        this.peerCount = result;
      }
    });
  }

  currentPercentage(currentBlock: string, highestBlock: string): number {
    return (parseInt(currentBlock, 10) / parseInt(highestBlock, 10)) * 100;
  }

  hexToInt(hexValue: string): number {
    return parseInt(hexValue, 10);
  }

  ngOnDestroy() {
    this.isListeningSubscription.unsubscribe();
    this.isSyncingSubscription.unsubscribe();
    this.peerCountSubscription.unsubscribe();
  }
}

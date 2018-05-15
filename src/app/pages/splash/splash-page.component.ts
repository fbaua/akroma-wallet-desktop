import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { ProgressbarConfig } from 'ngx-bootstrap/progressbar';

import { ISubscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { IntervalObservable } from 'rxjs/observable/IntervalObservable';
import { distinctUntilChanged, mergeMap, retry } from 'rxjs/operators';
import 'rxjs/add/observable/fromPromise';

import { Web3Service } from '../../providers/web3.service';

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
export class SplashPageComponent implements OnDestroy, OnInit {
  lastPercentageSynced: number;
  isSyncing: boolean | any;
  isListening: boolean;
  peerCount: number;
  isListeningSubscription: ISubscription;
  isSyncingSubscription: ISubscription;
  peerCountSubscription: ISubscription;

  constructor(private web3: Web3Service,
              private router: Router) {
    this.web3.setProvider(new this.web3.providers.HttpProvider('http://localhost:8545'));
    this.lastPercentageSynced = 0;
  }

  ngOnInit() {
    this.isListeningSubscription = IntervalObservable.create(10000)
    .pipe(mergeMap((i) => Observable.fromPromise(this.web3.eth.net.isListening())))
    .pipe(retry(10))
    .pipe(distinctUntilChanged())
    .subscribe((result: boolean) => {
      this.isListening = result;
    });

    this.isSyncingSubscription = IntervalObservable.create(1000)
    .pipe(mergeMap((i) => Observable.fromPromise(this.web3.eth.isSyncing())))
    .pipe(retry(10))
    .pipe(distinctUntilChanged())
    .subscribe((result: boolean | any) => {
      if (this.isListening) {
        this.isSyncing = result;
        if (!!result) {
          this.lastPercentageSynced = this.currentPercentage(result.currentBlock, result.highestBlock);
          console.log(this.lastPercentageSynced.toFixed(0));
        }
        if (result === false && (this.lastPercentageSynced || 0).toFixed(0) === '100') {
          // Nav away here
          console.log('nav away...');
          // If user has not set up a wallet yet, send them to create / import wallet
          // ...else send them to their last used wallet?
          this.router.navigate(['/wallet/1']);
        }
      }
    });

    this.peerCountSubscription = IntervalObservable.create(1000)
    .pipe(mergeMap((i) => Observable.fromPromise(this.web3.eth.net.getPeerCount())))
    .pipe(retry(10))
    .pipe(distinctUntilChanged())
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

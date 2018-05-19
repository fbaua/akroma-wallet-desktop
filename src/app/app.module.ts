import 'zone.js/dist/zone-mix';
import 'reflect-metadata';
import '../polyfills';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { HttpClientModule, HttpClient } from '@angular/common/http';

import { ProgressbarModule } from 'ngx-bootstrap';

import { AppRoutingModule } from './app-routing.module';

// NG Translate
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { ElectronService } from './providers/electron.service';

import { WebviewDirective } from './directives/webview.directive';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { SplashComponent } from './components/splash/splash.component';
import { Web3Service } from './providers/web3.service';
import { TransactionsPersistenceService } from './providers/transactions-persistence.service';
import { TransactionsService } from './providers/transactions.service';
import { SettingsPageComponent } from './pages/settings-page/settings-page.component';
import { SettingsPersistenceService } from './providers/settings-persistence.service';
import { SendTransactionComponent } from './components/send-transaction/send-transaction.component';
import { WalletListComponent } from './components/wallet-list/wallet-list.component';
import { AkromaClientService } from './providers/akroma-client.service';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    WebviewDirective,
    SplashComponent,
    SettingsPageComponent,
    SendTransactionComponent,
    WalletListComponent,
  ],
  imports: [
    RouterModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (HttpLoaderFactory),
        deps: [HttpClient]
      }
    }),
    ProgressbarModule.forRoot(),
  ],
  providers: [
    ElectronService,
    Web3Service,
    TransactionsService,
    TransactionsPersistenceService,
    SettingsPersistenceService,
    AkromaClientService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

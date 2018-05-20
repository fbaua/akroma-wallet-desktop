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

// Pages
import { SplashComponent } from './pages/splash/splash-page.component';
import { SettingsPageComponent } from './pages/settings-page/settings-page.component';
import { WalletDetailPageComponent } from './pages/wallet-detail/wallet-detail-page.component';

// Components
import { AppComponent } from './app.component';
import { WalletComponent } from './components/wallet/wallet.component';
import { TransactionListComponent } from './components/transaction-list/transaction-list.component';
import { WalletActionsComponent } from './components/wallet-actions/wallet-actions.component';
import { SendTransactionComponent } from './components/send-transaction/send-transaction.component';
import { WalletListComponent } from './components/wallet-list/wallet-list.component';

// Services
import { AkromaClientService } from './providers/akroma-client.service';
import { ElectronService } from './providers/electron.service';
import { SettingsPersistenceService } from './providers/settings-persistence.service';
import { TransactionsPersistenceService } from './providers/transactions-persistence.service';
import { TransactionsService } from './providers/transactions.service';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    WalletDetailPageComponent,
    SettingsPageComponent,
    SendTransactionComponent,
    SplashComponent,
    TransactionListComponent,
    WalletComponent,
    WalletActionsComponent,
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
    TransactionsService,
    TransactionsPersistenceService,
    SettingsPersistenceService,
    AkromaClientService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { HomeComponent } from './components/home/home.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SplashComponent } from './components/splash/splash.component';
// import { SettingsPageComponent } from './pages/settings-page/settings-page.component';
// import { WalletListComponent } from './components/wallet-list/wallet-list.component';

const routes: Routes = [
    {
        path: '',
        // component: WalletListComponent,
        // component: SettingsPageComponent,
        component: SplashComponent,
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {useHash: true})],
    exports: [RouterModule]
})
export class AppRoutingModule { }

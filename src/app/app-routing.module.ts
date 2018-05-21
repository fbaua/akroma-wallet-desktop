import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SplashComponent } from './pages/splash/splash-page.component';
import { WalletDetailPageComponent } from './pages/wallet-detail/wallet-detail-page.component';

const routes: Routes = [
    {
        path: '',
        component: SplashComponent,
    },
    {
        path: 'wallet/:id',
        component: WalletDetailPageComponent,
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {useHash: true})],
    exports: [RouterModule]
})
export class AppRoutingModule { }

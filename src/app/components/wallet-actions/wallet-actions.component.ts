import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-wallet-actions',
  templateUrl: './wallet-actions.component.html',
  styleUrls: ['./wallet-actions.component.scss']
})
export class WalletActionsComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  navigate(targetRoute: string) {
    this.router.navigate([targetRoute]);
  }

}

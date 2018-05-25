import { Component, Input, OnInit, ChangeDetectionStrategy, OnChanges, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, AbstractControl } from '@angular/forms';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { Wallet } from '../../models/wallet';
import { Web3Service } from '../../providers/web3.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-send-transaction',
  templateUrl: './send-transaction.component.html',
  styleUrls: ['./send-transaction.component.scss'],
})
export class SendTransactionComponent implements OnChanges {
  amountSelected: boolean;
  sendForm: FormGroup;
  modalRef: BsModalRef;
  passphrase: string;
  @ViewChild('sendTransactionPassphrase') passphraseModal: TemplateRef<any>;
  @Input() wallet: Wallet;
  widthExp: number;

  constructor(private fb: FormBuilder,
              private modalService: BsModalService,
              private web3: Web3Service) {
    this.widthExp = 100;
    this.amountSelected = false;
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.web3);
    if (changes.wallet.isFirstChange()) {
      return;
    }
    this.buildStockForm();
  }

  buildStockForm() {
    this.sendForm = this.fb.group({
      to: '',
      from: this.wallet.address,
      value: [0, Validators.min(0)],
      data: ['', this.hexValidator],
      gas: 21000,
    });
  }

  hexValidator(formcontrol: AbstractControl) {
      const a = parseInt(formcontrol.value, 16);
      return (a.toString(16) === formcontrol.value) ? null : { hex: { valid: false } };
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  async sendTransaction() {
    // TODO: Need to install bignumber library for keeping decimal accuracy
    try {
      const tx = {
        ...this.sendForm.value,
        value: this.web3.utils.toWei(this.sendForm.value.value, 'ether'),
      };
      this.web3.eth.personal.sendTransaction(this.sendForm.value, this.passphrase);
      this.buildStockForm();
      this.passphrase = '';
    } catch {
      // in case of exception, always clear passphrase and form
      this.buildStockForm();
      this.passphrase = '';
    }
    this.modalRef.hide();
  }
}

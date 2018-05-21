import { Injectable } from '@angular/core';

declare var require: any;
const Web3 = require('web3');

@Injectable()
export class Web3Service extends Web3 { }

import { Injectable } from '@angular/core';

const Web3 = require('web3');
declare var require: any;

import { Net, Eth, Provider, Providers } from 'web3/types';

@Injectable()
export class Web3Service extends Web3 { }

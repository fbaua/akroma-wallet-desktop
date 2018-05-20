import { Injectable } from '@angular/core';

declare var require: any;
const Web3 = require('web3');

import { Net, Eth, Provider, Providers } from 'web3/types';

@Injectable()
export class Web3Service extends Web3 { }

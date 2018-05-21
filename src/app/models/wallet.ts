export interface Wallet {
    _id?: string;
    _rev?: string;
    address?: string;
    name?: string;
    balance?: number;
    minedBlocks?: number;
    transactions?: number;
}

import { CandyType } from './enum/candytype.enum';

export class Candy {
    constructor(public cid: number, public type: CandyType) {}
}
import { CandyType } from './enum/candytype.enum';

export class Candy {
    constructor(public x: number,public y:number, public type: CandyType) {}
}
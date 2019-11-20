import { Tiles} from './tiles.model';

export class Row {
    constructor(public cid: number, public tasks: Tiles[]) {}
}
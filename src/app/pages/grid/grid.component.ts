import { Component, OnInit } from '@angular/core';
import { Board } from 'src/app/models/board.model';
import { Row } from 'src/app/models/row.model';
import { Tiles } from 'src/app/models/tiles.model';
@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit {

  
  constructor() { }
  ngOnInit() {
  }
 
  board: Board = new Board('CandyCrush', [
    new Row(1, [
      new Tiles(1, { src: 'app/resources/icons/candy1.png' }),
      new Tiles(2, { src: 'app/resources/icons/candy2.png' }),
      new Tiles(3, { src: 'app/resources/icons/candy3.png' })
      ]),
    new Row(2, [
        new Tiles(1, { src: 'app/resources/icons/candy3.png' }),
        new Tiles(2, { src: 'app/resources/icons/candy2.png' }),
        new Tiles(3, { src: 'app/resources/icons/candy1.png' })
      ]),
    new Row(3, [
        new Tiles(1, { src: 'app/resources/icons/candy2.png' }),
        new Tiles(2, { src: 'app/resources/icons/candy1.png' }),
        new Tiles(3, { src: 'app/resources/icons/candy4.png' })
      ]) 
  ]);

 
}

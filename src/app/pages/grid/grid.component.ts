import { Component, OnInit } from '@angular/core';
import { Board } from 'src/app/models/board.model';
import { Row } from 'src/app/models/row.model';
import { Tiles } from 'src/app/models/tiles.model';
import { Candy } from 'src/app/models/candy.model';
import { v4 as uuid } from 'uuid';
import { CandyType } from 'src/app/models/enum/candytype.enum';
@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit {

  board: Board = new Board([])
  numOfRows: number = 3
  numOfColumns: number = 3
  
  constructor() { 
  }

  getRandomCandy(): CandyType {
    var value = Math.floor(Math.random() * Math.floor(3));
    if (value == 0) {
      return CandyType.Blue
    } else if (value == 1) {
      return CandyType.Green
    } else if (value ==2) {
      return CandyType.Red
    }
  }

  ngOnInit() {
    for (var row = 0; row < this.numOfRows; row ++) {
      this.board.grid[row] = []
      for (var column = 0; column < this.numOfColumns; column ++) {
        var candy = new Candy(uuid(), this.getRandomCandy())
        this.board.grid[row][column] = candy
      }
    }
  }
}

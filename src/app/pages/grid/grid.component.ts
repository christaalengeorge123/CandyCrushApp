import { Component, OnInit } from '@angular/core';
import { Board } from 'src/app/models/board.model';
import { Row } from 'src/app/models/row.model';
import { Tiles } from 'src/app/models/tiles.model';
import { Candy } from 'src/app/models/candy.model';
import { v4 as uuid } from 'uuid';
import { CandyType } from 'src/app/models/enum/candytype.enum';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit {

  board: Board = new Board([])
  numOfRows: number = 2
  numOfColumns: number = 3

  constructor(
    private titleService: Title

  ) {
    this.titleService.setTitle('CandyCrush');
  }

  getRandomCandy(): CandyType {
    var value = Math.floor(Math.random() * Math.floor(3));
    if (value == 0) {
      return CandyType.Blue
    } else if (value == 1) {
      return CandyType.Green
    } else if (value == 2) {
      return CandyType.Red
    }
  }

  ngOnInit() {
    for (var row = 0; row < this.numOfRows; row++) {
      this.board.grid[row] = []
      for (var column = 0; column < this.numOfColumns; column++) {
        var candy = new Candy(row,column, this.getRandomCandy())
        console.log(candy.type)
        this.board.grid[row][column] = candy
      }
    }
  }

  onSwipeLeft(event, candy: Candy) {
    if (candy.y == 0) {
      return
    }

    var row = this.board.grid[candy.x]
    var leftSideCandy = row[candy.y - 1]    
    moveItemInArray(row, candy.y, candy.y - 1);

    candy.y -= 1
    leftSideCandy.y += 1
  }
  onSwipeRight(event, candy: Candy) {
    var row = this.board.grid[candy.x]
    if (candy.y == row.length - 1) {
      return
    }

    var rightSideCandy = row[candy.y + 1]    
    moveItemInArray(row, candy.y, candy.y + 1);

    candy.y += 1
    rightSideCandy.y -= 1
  }

  onSwipeUp(event, candy: Candy) {
    if (candy.x == 0) {
      return
    }
  }
  onSwipeDown(event, candy: Candy) {
    console.log("swiperight " + candy)
  }


  // drop(event: CdkDragDrop<any>) {
  //   if (event.previousContainer === event.container) {
  //     console.log("Equal = " + event + " " + event.previousIndex + event.currentIndex)
  //     console.log(event.container.data)
  //     //moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  //   } else {
  //     console.log("Not Equal = " + event + " " + event.previousIndex + event.currentIndex)
  //   }
    
  // }

}

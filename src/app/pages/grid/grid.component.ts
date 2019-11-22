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
  numOfRows: number = 4
  numOfColumns: number = 4

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
        var candy = new Candy(row, column, this.getRandomCandy())
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

    var success = this.localCheck(0, candy.x, candy.y, 0, candy.type);
    var success2 = this.localCheck(0, candy.x, candy.y + 1, 0, this.board.grid[candy.x][candy.y+1].type);
    //if both becomes fails swipe back.
    if (success == 0 && success2 == 0) {
      var rightSideCandy = row[candy.y + 1]
      moveItemInArray(row, candy.y, candy.y + 1);

      candy.y += 1
      rightSideCandy.y -= 1
    }

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

    var success = this.localCheck(0, candy.x, candy.y, 0, candy.type);
    var success2 = this.localCheck(0, candy.x, candy.y - 1, 0, this.board.grid[candy.x][candy.y-1].type);
    if (success == 0 && success2 == 0) {
      var leftSideCandy = row[candy.y - 1]
    moveItemInArray(row, candy.y, candy.y - 1);

    candy.y -= 1
    leftSideCandy.y += 1
    }
  }

  onSwipeUp(event, candy: Candy) {
    if (candy.x == 0) {
      return
    }
    var currentCandy = this.board.grid[candy.x][candy.y]
    var candyaboveCurrent = this.board.grid[candy.x - 1][candy.y]
    var currentType = currentCandy.type
    currentCandy.type = candyaboveCurrent.type
    candyaboveCurrent.type = currentType

    var success = this.localCheck(0, candy.x, candy.y, 0, candy.type);
    var success2 = this.localCheck(0, candy.x-1, candy.y , 0, this.board.grid[candy.x-1][candy.y].type);
    if (success == 0 && success2 == 0) {
      console.log(success);
      var currentCandy = this.board.grid[candy.x][candy.y]
      var candyBelowCurrent = this.board.grid[candy.x - 1][candy.y]
  
      //console.log("currentcandy"+currentCandy)
      // Exchange the type of the two candies.
      var currentType = currentCandy.type
      currentCandy.type = candyBelowCurrent.type
      candyBelowCurrent.type = currentType

    }
  }
  onSwipeDown(event, candy: Candy) {
    if (candy.x == this.numOfRows - 1) {
      return
    }
    var currentCandy = this.board.grid[candy.x][candy.y]
    var candyBelowCurrent = this.board.grid[candy.x + 1][candy.y]

    //console.log("currentcandy"+currentCandy)
    // Exchange the type of the two candies.
    var currentType = currentCandy.type
    currentCandy.type = candyBelowCurrent.type
    candyBelowCurrent.type = currentType

    var success = this.localCheck(0, candy.x, candy.y, 0, candy.type);
    var success2 = this.localCheck(0, candy.x+1, candy.y , 0, this.board.grid[candy.x+1][candy.y].type);
    if (success == 0 && success2 == 0) {
      console.log(success);
      var currentCandy = this.board.grid[candy.x][candy.y]
      var candyBelowCurrent = this.board.grid[candy.x + 1][candy.y]
  
      //console.log("currentcandy"+currentCandy)
      // Exchange the type of the two candies.
      var currentType = currentCandy.type
      currentCandy.type = candyBelowCurrent.type
      candyBelowCurrent.type = currentType

    }
  }





 public localCheck(direction: number, x: number, y: number, sum: number, type: CandyType) {
  var up = 0;
  var down = 0;
  var left = 0;
  var right = 0;
  var success = false;

  if (direction == 0) {
    up = this.localCheck(1, x, (y + 1), 0, type);
    down = this.localCheck(2, x, (y - 1), 0, type);
    left = this.localCheck(3, (x - 1), y, 0, type);
    right = this.localCheck(4, (x + 1), y, 0, type);

  } else if (direction == 1) {

    if (y < this.numOfRows) {

      if (this.board.grid[x][y].type == type) {

        sum += 1;
        return this.localCheck(1, x, (y + 1), sum, type);

      } else {
        return sum;
      }
    } else {
      return sum;
    }

  } else if (direction == 2) {
    if (y >= 0) {

      if (this.board.grid[x][y].type == type) {

        sum += 1;
        return this.localCheck(2, x, (y - 1), sum, type);

      } else {
        return sum;
      }

    } else {
      return sum;
    }
  } else if (direction == 3) {
    if (x >= 0) {

      if (this.board.grid[x][y].type == type) {

        sum += 1;
        return this.localCheck(3, (x - 1), y, sum, type);

      } else {
        return sum;
      }

    } else {
      return sum;
    }

  } else if (direction == 4) {
    if (x < this.numOfRows) {

      if (this.board.grid[x][y].type == type) {

        sum += 1;
        return this.localCheck(4, (x + 1), y, sum, type);

      } else {
        return sum;
      }

    } else {
      return sum;
    }

  }

  //_____deleting candies____________________________________________________
  if ((up + down) >= 2) {
    for (var i = 0; i <= up; i++) {
      this.board.grid[x][y + i].type = CandyType.nocolor;
    }
    for (var i = 0; i <= down; i++) {
      this.board.grid[x][y - i].type = CandyType.nocolor;
    }
    success = true;
  }
  if ((left + right) >= 2) {
    for (var i = 0; i <= left; i++) {
      this.board.grid[x - i][y].type = CandyType.nocolor;
    }
    for (var i = 0; i <= right; i++) {
      this.board.grid[x + i][y].type = CandyType.nocolor;
      success = true;
    }
  }


  if (success == true) {
    return 1;
  }
  return 0;

}
}





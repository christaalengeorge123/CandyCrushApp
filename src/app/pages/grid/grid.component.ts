import { Component, OnInit } from '@angular/core';
import { Board } from 'src/app/models/board.model';
import { Row } from 'src/app/models/row.model';
import { Tiles } from 'src/app/models/tiles.model';
import { Candy } from 'src/app/models/candy.model';
import { v4 as uuid } from 'uuid';
import { CandyType } from 'src/app/models/enum/candytype.enum';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Title } from '@angular/platform-browser';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { DialoglooseComponent } from '../dialogloose/dialogloose.component';
import { ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  keyframes
} from '@angular/animations';
import { timeout } from 'q';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
  animations: [
    trigger('animateCandy', [
      state('blue', style({
        opacity: 1,
        transform: 'translateY(0%)',
        'background-image': "url('assets/bluecandy.jpg')"
      })),
      state('red', style({
        opacity: 1,
        transform: 'translateY(0%)',
        'background-image': "url('assets/redcandy.jpg')"
      })),
      state('green', style({
        opacity: 1,
        transform: 'translateY(0%)',
        'background-image': "url('assets/Greencandy.png')"
      })),
      state('yellow', style({
        opacity: 1,
        transform: 'translateY(0%)',
        'background-image': "url('assets/browncandy.png')",

      })),
      state('violet', style({
        opacity: 1,
        transform: 'translateY(0%)',
        'background-image': "url('assets/Purplejelly.png')"
      })),
      state('orange', style({
        opacity: 1,
        transform: 'translateY(0%)',
        'background-image': "url('assets/candy2.png')"
      })),
      transition('* => nocolor', [
        animate('0.5s', keyframes([
          style({ opacity: 0 }),
        ]
        ))
      ]),/*
      transition('* => *', [
        animate('0.5s', keyframes([
          style({ transform: 'translateY(-75%)' }),
          style({ transform: 'translateY(-50%)' }),
          style({ transform: 'translateY(-25%)' }),
          style({ transform: 'translateY(0%)' })
        ]

        ))
      ]) */
    ])
  ]
})
export class GridComponent implements OnInit {
  score: number = 0;
  turns: number = 10;
  scoreToBeat: number = 50;
  board: Board = new Board([])
  numOfRows: number = 6
  numOfColumns: number = 6
  matrix: string;
  size:number;

  constructor(
    private titleService: Title, public dialog: MatDialog, private route: ActivatedRoute

  ) {
    this.titleService.setTitle('CandyCrush');
  }

  getRandomCandy(): CandyType {
    var value = Math.floor(Math.random() * Math.floor(6));
    if (value == 0) {
      return CandyType.Blue
    } else if (value == 1) {
      return CandyType.Green
    } else if (value == 2) {
      return CandyType.Red
    } else if (value == 3) {
      return CandyType.yellow
    } else if (value == 4) {
      return CandyType.violet
    } else if (value == 5) {
      return CandyType.orange
    }
  }

  ngOnInit() {

    this.matrix = this.route.snapshot.queryParamMap.get("matrix")
    this.route.queryParamMap.subscribe(queryParams => {
      this.matrix = queryParams.get("matrix")
    })
    // this.matrix = this.route.snapshot.paramMap.get("matrix")
    console.log("matrix is" + this.matrix); // popular
    var y = +this.matrix;
    this.size=(y*60)+((y*5)-5)
    this.numOfRows=y;
    this.numOfColumns=y;


    for (var row = 0; row < this.numOfRows; row++) {
      this.board.grid[row] = []
      for (var column = 0; column < this.numOfColumns; column++) {
        var candy = new Candy(row, column, this.getRandomCandy())
        console.log(candy.type)
        this.board.grid[row][column] = candy
      }
    }
    this.checkGrid();
    // this.showDialogloose();


  }

  onSwipeLeft(event, candy: Candy) {
    if (candy.y == 0 || this.turns == 0) {
      return
    }

    var row = this.board.grid[candy.x]
    var leftSideCandy = row[candy.y - 1]
    moveItemInArray(row, candy.y, candy.y - 1);

    candy.y -= 1
    leftSideCandy.y += 1

    var success = this.localCheck(0, candy.x, candy.y, 0, candy.type);
    var success2 = this.localCheck(0, candy.x, candy.y + 1, 0, this.board.grid[candy.x][candy.y + 1].type);
    //if both becomes fails swipe back.
    if (success == 0 && success2 == 0) {
      var rightSideCandy = row[candy.y + 1]
      moveItemInArray(row, candy.y, candy.y + 1);

      candy.y += 1
      rightSideCandy.y -= 1
    } else {
      this.turns--
      console.log(this.turns)
      setTimeout(() => {
        this.shiftCandy();
      }, 600);
    }

  }
  onSwipeRight(event, candy: Candy) {
    var row = this.board.grid[candy.x]
    if (candy.y == row.length - 1 || this.turns == 0) {
      return


    }

    var rightSideCandy = row[candy.y + 1]
    moveItemInArray(row, candy.y, candy.y + 1);

    candy.y += 1
    rightSideCandy.y -= 1

    var success = this.localCheck(0, candy.x, candy.y, 0, candy.type);
    var success2 = this.localCheck(0, candy.x, candy.y - 1, 0, this.board.grid[candy.x][candy.y - 1].type);
    if (success == 0 && success2 == 0) {
      var leftSideCandy = row[candy.y - 1]
      moveItemInArray(row, candy.y, candy.y - 1);

      candy.y -= 1
      leftSideCandy.y += 1
    } else {
      this.turns--
      setTimeout(() => {
        this.shiftCandy();
      }, 600);
    }
  }

  onSwipeUp(event, candy: Candy) {
    if (candy.x == 0 || this.turns == 0) {
      return
    }
    var currentCandy = this.board.grid[candy.x][candy.y]
    var candyaboveCurrent = this.board.grid[candy.x - 1][candy.y]
    var currentType = currentCandy.type
    currentCandy.type = candyaboveCurrent.type
    candyaboveCurrent.type = currentType

    var success = this.localCheck(0, candy.x, candy.y, 0, candy.type);
    var success2 = this.localCheck(0, candy.x - 1, candy.y, 0, this.board.grid[candy.x - 1][candy.y].type);
    if (success == 0 && success2 == 0) {
      console.log(success);
      var currentCandy = this.board.grid[candy.x][candy.y]
      var candyBelowCurrent = this.board.grid[candy.x - 1][candy.y]

      //console.log("currentcandy"+currentCandy)
      // Exchange the type of the two candies.
      var currentType = currentCandy.type
      currentCandy.type = candyBelowCurrent.type
      candyBelowCurrent.type = currentType

    } else {
      this.turns--
      setTimeout(() => {
        this.shiftCandy();
      }, 600);
    }
  }
  onSwipeDown(event, candy: Candy) {
    if (candy.x == this.numOfRows - 1 || this.turns == 0) {
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
    var success2 = this.localCheck(0, candy.x + 1, candy.y, 0, this.board.grid[candy.x + 1][candy.y].type);
    if (success == 0 && success2 == 0) {
      console.log(success);
      var currentCandy = this.board.grid[candy.x][candy.y]
      var candyBelowCurrent = this.board.grid[candy.x + 1][candy.y]

      //console.log("currentcandy"+currentCandy)
      // Exchange the type of the two candies.
      var currentType = currentCandy.type
      currentCandy.type = candyBelowCurrent.type
      candyBelowCurrent.type = currentType

    } else {
      this.turns--
      setTimeout(() => {
        this.shiftCandy();
      }, 600);
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
        if (this.board.grid[x][y + i].type != CandyType.nocolor) {
          this.score++;
        }
      }
      for (var i = 0; i <= down; i++) {
        if (this.board.grid[x][y - i].type != CandyType.nocolor) {
          this.score++;
        }
        this.board.grid[x][y - i].type = CandyType.nocolor;

      }
      success = true;
    }
    if ((left + right) >= 2) {
      for (var i = 0; i <= left; i++) {
        if (this.board.grid[x - i][y].type != CandyType.nocolor) {
          this.score++;
        }
        this.board.grid[x - i][y].type = CandyType.nocolor;
      }
      for (var i = 0; i <= right; i++) {
        if (this.board.grid[x + i][y].type != CandyType.nocolor) {
          this.score++;
        }
        this.board.grid[x + i][y].type = CandyType.nocolor;
        success = true;
      }
    }
    this.wait(10)
    console.log(this.score)
    if (success == true) {
      return 1;
    }
    return 0;

  }
  public shiftCandy() {
    let temporary = 0;
    //loop through 2d matrix from bottom right to top left
    for (let i = this.numOfRows - 1; i >= 0; i--) {
      for (let k = this.numOfColumns - 1; k >= 0; k--) {
        //iterate through 2dmatrix, if you find an 'E' colored candy:
        let temp = i;
        let mark = i;
        while ((this.board.grid[temp][k].type == CandyType.nocolor) && (temp - 1 >= 0)) {
          //if u find a colored candy above E, swap them
          if (this.board.grid[temp - 1][k].type != CandyType.nocolor) {
            //couldnt swap for some reason so just decided to swap colors
            this.board.grid[mark][k].type = this.board.grid[temp - 1][k].type;
            this.board.grid[temp - 1][k].type = CandyType.nocolor;
            this.slideDown(mark, k)
            break;
          }
          //if u find another E on top, keep going up
          else {
            temp--;
          }
        }
        //if you made it all the way up to the top, make the whole row random candies
        if (temp <= 0) {
          for (let j = mark; j >= 0; j--) {
            //this.board.grid[j][k].type = this.getRandomCandy()
          }
        }
        else {
          for (let j = 0; j < this.numOfRows; j++) {
            if (this.board.grid[0][j].type == CandyType.nocolor) {
              this.board.grid[0][j].type = this.getRandomCandy();
              this.slideDown(0, j)
            }
          }
        }

      }
    }
    setTimeout(() => {
      this.checkGrid();
    }, 600);
  }

  //returns an array of coordinates to delete
  public checkGrid() {
    let removeCandyArr = [];
    var vdict = {}; var hcount = 0; var hArr = []; let colorMarker = CandyType.nocolor;
    //iterate through 2d matrix
    for (let i = 0; i < this.numOfRows; i++) {
      for (let k = 0; k < this.numOfColumns; k++) {
        //console.log(hArr); 

        //if dict doesnt exist, put in first entry
        // dict = { 
        //    '0' : ['G', 2, [[0,0], [1,0]]
        // }
        //checking for horizontal 3 in a row
        if (this.board.grid[i][k].type != colorMarker) {
          if (hcount >= 3) {
            for (let j = 0; j < hArr.length; j++) {

              removeCandyArr.push(hArr[j]);
            }
          }
          hArr = [];
          hArr.push([i, k]);
          hcount = 1;
          colorMarker = this.board.grid[i][k].type;
        } else {
          hArr.push([i, k]);
          hcount += 1;
        }
        //check for vertical 3 or more using hashmap w/ array
        //uses k index as key and 1st index of value is letter, 2nd is count, 3rd is array of coordinates
        if (typeof vdict[k] == "undefined") {
          vdict[k] = [];
          vdict[k][0] = this.board.grid[i][k].type;
          vdict[k][1] = 1;
          vdict[k][2] = [[i, k]];
        }
        else {
          if (vdict[k][0] == this.board.grid[i][k].type) {
            vdict[k][1] += 1;
            vdict[k][2].push([i, k]);
          }
          else {
            if (vdict[k][1] >= 3) {
              for (let j = 0; j < vdict[k][2].length; j++) {

                removeCandyArr.push(vdict[k][2][j]);
              }
            }
            vdict[k][0] = this.board.grid[i][k].type;
            vdict[k][1] = 1;
            vdict[k][2] = [[i, k]];
          }
        }
      }
      if (hcount >= 3) {
        for (let j = 0; j < hArr.length; j++) {
          console.log(1)
          removeCandyArr.push(hArr[j]);
        }
      }
      colorMarker = CandyType.nocolor;
      hArr = [];
      hcount = 0;
    }
    //another checker after finish iterating through 2d matrix. final checker to see if last element creates 3 or more in a vertical row
    for (let i = 0; i < this.numOfRows; i++) {
      if (vdict[i][1] >= 3) {
        for (let j = 0; j < vdict[i][2].length; j++) {
          console.log(2);
          removeCandyArr.push(vdict[i][2][j]);
        }
      }
    }
    //final checker to see if last element makes a 3 or more in a horizontal row
    if (hcount >= 3) {
      for (let j = 0; j < hArr.length; j++) {
        console.log(3);
        removeCandyArr.push(hArr[j]);
      }
    }
    this.removeCandy(removeCandyArr)
    return removeCandyArr;
  }

  //returns an array with 'E' marked candies to delete 
  public removeCandy(removeCandyArr) {
    // let set = new Set(removeCandyArr.map(JSON.stringify));
    // let newRemoveCandyArr = Array.from(set).map(JSON.parse);
    let newRemoveCandyArr = removeCandyArr;
    if (removeCandyArr.length != 0) {


      //take in 2d matrix and arr of coordinates to replace value with 'E'
      for (let i = 0; i < newRemoveCandyArr.length; i++) {
        this.board.grid[newRemoveCandyArr[i][0]][newRemoveCandyArr[i][1]].type = CandyType.nocolor;
        this.score++;
      }
      console.log(this.score)
      setTimeout(() => {
        this.shiftCandy();
      }, 600);
    } else if (this.turns == 0) {
      if (this.score >= this.scoreToBeat) {
        this.showDialog();
      } else {
        this.showDialogloose();
      }
    } else this.checkValidGrid();
  }
  public wait(ms) {
    var start = Date.now(),
      now = start;
    while (now - start < ms) {
      now = Date.now();
    }
  }
  public checkValidGrid() {

    //check each candy
    for (let i = 0; i < this.numOfRows; i++) {
      for (let j = 0; j < this.numOfColumns; j++) {

        //checks if there is a candy adjacent and if so, if there is any candy that can be moved on the other side
        //to make a 3 in a row

        //adjacent is right so checks candies left
        if (j + 1 < this.numOfColumns) {
          if (this.board.grid[i][j + 1].type == this.board.grid[i][j].type) {
            if (j - 2 >= 0) {
              if (this.board.grid[i][j - 2].type == this.board.grid[i][j].type) {
                return
              }
            }
            if (i - 1 >= 0 && j - 1 >= 0) {
              if (this.board.grid[i - 1][j - 1].type == this.board.grid[i][j].type) {
                return
              }
            }
            if (i + 1 < this.numOfRows && j - 1 >= 0) {
              if (this.board.grid[i + 1][j - 1].type == this.board.grid[i][j].type) {
                return
              }
            }
          }
        }
        //adjacent is left so checks candies right
        if (j - 1 >= 0) {
          if (this.board.grid[i][j - 1].type == this.board.grid[i][j].type) {
            if (j + 2 < this.numOfColumns) {
              if (this.board.grid[i][j + 2].type == this.board.grid[i][j].type) {
                return
              }
            }
            if (i - 1 >= 0 && j + 1 < this.numOfColumns) {
              if (this.board.grid[i - 1][j + 1].type == this.board.grid[i][j].type) {
                return
              }
            }
            if (i + 1 < this.numOfRows && j + 1 < this.numOfColumns) {
              if (this.board.grid[i + 1][j + 1].type == this.board.grid[i][j].type) {
                return
              }
            }
          }
        }
        //adjacent is below so checks candies above
        if (i + 1 < this.numOfRows) {
          if (this.board.grid[i + 1][j].type == this.board.grid[i][j].type) {
            if (i - 2 >= 0) {
              if (this.board.grid[i - 2][j].type == this.board.grid[i][j].type) {
                return
              }
            }
            if (i - 1 >= 0 && j - 1 >= 0) {
              if (this.board.grid[i - 1][j - 1].type == this.board.grid[i][j].type) {
                return
              }
            }
            if (i - 1 >= 0 && j + 1 < this.numOfColumns) {
              if (this.board.grid[i - 1][j + 1].type == this.board.grid[i][j].type) {
                return
              }
            }
          }
        }
        //adjacent is above so checks candies below
        if (i - 1 >= 0) {
          if (this.board.grid[i - 1][j].type == this.board.grid[i][j].type) {
            if (i + 2 < this.numOfRows) {
              if (this.board.grid[i + 2][j].type == this.board.grid[i][j].type) {
                return
              }
            }
            if (i + 1 < this.numOfRows && j - 1 >= 0) {
              if (this.board.grid[i + 1][j - 1].type == this.board.grid[i][j].type) {
                return
              }
            }
            if (i + 1 < this.numOfRows && j + 1 < this.numOfColumns) {
              if (this.board.grid[i + 1][j + 1].type == this.board.grid[i][j].type) {
                return
              }
            }
          }
        }

        //checks to see if candy can be moved between two candies to make a 3 in a row

        //above
        if (i - 1 >= 0) {
          if (j - 1 >= 0 && j + 1 < this.numOfColumns) {
            if (this.board.grid[i - 1][j - 1].type == this.board.grid[i][j].type && this.board.grid[i - 1][j + 1].type == this.board.grid[i][j].type) {
              return
            }
          }
        }
        //below
        if (i + 1 < this.numOfRows) {
          if (j - 1 >= 0 && j + 1 < this.numOfColumns) {
            if (this.board.grid[i + 1][j - 1].type == this.board.grid[i][j].type && this.board.grid[i + 1][j + 1].type == this.board.grid[i][j].type) {
              return
            }
          }
        }
        //left
        if (j - 1 >= 0) {
          if (i - 1 >= 0 && i + 1 < this.numOfRows) {
            if (this.board.grid[i - 1][j - 1].type == this.board.grid[i][j].type && this.board.grid[i + 1][j - 1].type == this.board.grid[i][j].type) {
              return
            }
          }
        }
        //right
        if (j + 1 < this.numOfColumns) {
          if (i - 1 >= 0 && i + 1 < this.numOfRows) {
            if (this.board.grid[i - 1][j + 1].type == this.board.grid[i][j].type && this.board.grid[i + 1][j + 1].type == this.board.grid[i][j].type) {
              return
            }
          }
        }
      }
    }
    alert("no more moves available")
    this.colorScramble();
  }

  public colorScramble() {
    var colorDict = {}

    //records the number of each color
    for (var i = 0; i < this.numOfRows; i++) {
      for (var j = 0; j < this.numOfColumns; j++) {
        if (isNaN(colorDict[this.board.grid[i][j].type])) {
          colorDict[this.board.grid[i][j].type] = 1;
        } else {
          colorDict[this.board.grid[i][j].type] += 1;
        }
      }
    }

    //replaces candies with other candies
    for (var i = 0; i < this.numOfRows; i++) {
      for (var j = 0; j < this.numOfColumns; j++) {
        var done = false;
        while (done == false) {
          var color: CandyType = this.getRandomCandy();
          if (colorDict[color] > 0) {
            this.board.grid[i][j].type = color;
            colorDict[color] -= 1;
            done = true;
          }
        }
      }
    }
    this.checkGrid()

  }


  showDialog() {
    const dialogConfig = new MatDialogConfig();
    const dialogRef = this.dialog.open(DialogComponent, dialogConfig);

  }
  showDialogloose() {
    const dialogConfig = new MatDialogConfig();
    const dialogRef = this.dialog.open(DialoglooseComponent, dialogConfig);
  }
  public slideDown(x: number, y: number) {
    var temp: string = x.toString() + y.toString()
    console.log(temp)
    document.getElementById(temp).animate([
      { transform: 'translateY(-75%)' },
      { transform: 'translateY(0%)' }
    ], {
      duration: 600
    });
  }
}





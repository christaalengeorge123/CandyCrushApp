import { Component, OnInit } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { Board } from 'src/app/models/board.model';



@Component({
  selector: 'app-main-view',
  templateUrl: './main-view.component.html',
  styleUrls: ['./main-view.component.scss']
})
export class MainViewComponent implements OnInit {
  item:string;
  
  constructor() { }
  displayAddCard = false;
  displayupdateCard=false;
  
 

  
  
  

  ngOnInit() {
    // var column: Column = new Column("Ideas", []);
    // var task: Task = new Task("Task 1", false);
    // column.tasks.push(task)
    
    // this.board.columns.push(column)
    
  }
  
  
}

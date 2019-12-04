import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainViewComponent } from './pages/main-view/main-view.component';

import {DragDropModule} from '@angular/cdk/drag-drop';
import { RegisterComponent } from './pages/register/register.component';
import { GridComponent } from './pages/grid/grid.component';
import * as Hammer from 'hammerjs';
import { HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MapComponent } from './pages/map/map.component';

import { MatButtonModule, MatDialogModule } from '@angular/material';
import { DialogComponent } from './pages/dialog/dialog.component';
import { DialoglooseComponent } from './pages/dialogloose/dialogloose.component';


export class MyHammerConfig extends HammerGestureConfig {
  overrides = <any> {
    swipe: { direction: Hammer.DIRECTION_ALL },
  };
}

@NgModule({
  declarations: [
    AppComponent,
    MainViewComponent,
    RegisterComponent,
    GridComponent,
    MapComponent,
    DialogComponent,
    DialoglooseComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DragDropModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatDialogModule
  ],
  entryComponents: [
    DialogComponent,
    DialoglooseComponent
  ],
  providers: [
    {provide: HAMMER_GESTURE_CONFIG,
    useClass: MyHammerConfig}],
  bootstrap: [AppComponent]
})
export class AppModule { }

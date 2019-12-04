import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainViewComponent } from './pages/main-view/main-view.component';
import { RegisterComponent } from './pages/register/register.component';
import { GridComponent } from './pages/grid/grid.component';
import { MapComponent } from './pages/map/map.component';

const routes: Routes = [
  {
    path:'register',
    component:RegisterComponent
  },
  { path: '', 
    component : MainViewComponent
  },
  {
    path:'grid',
    component:GridComponent
  },
  {
    path:'grid/map',
    component:MapComponent
  },
  {
    path:'map',
    component:MapComponent
  },
  {
    path:'map/grid',
    component:GridComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

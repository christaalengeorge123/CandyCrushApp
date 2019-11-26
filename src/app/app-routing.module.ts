import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainViewComponent } from './pages/main-view/main-view.component';
import { RegisterComponent } from './pages/register/register.component';
import { GridComponent } from './pages/grid/grid.component';


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
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

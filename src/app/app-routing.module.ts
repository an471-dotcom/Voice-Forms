import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AppComponent} from './app.component'
import { AuthGuard } from './auth.guard';
import   {CreateComponent} from './create/create.component'
import { DisplayComponent } from './display/display.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
const routes: Routes = [
  {path:'',component:LoginComponent},
  {path:'home',component:HomeComponent,canActivate:[AuthGuard]},
  {path:'create',component:CreateComponent,canActivate:[AuthGuard]},
  {path:'create/:id',component:CreateComponent},
  {path:'display',component:DisplayComponent,canActivate:[AuthGuard]},
  {path:'display/:id',component:DisplayComponent,canActivate:[AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ReportComponent } from './report/report.component';
import { EditDataComponent } from './edit-data/edit-data.component';
import { AddDataComponent } from './add-data/add-data.component';


const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'report', component: ReportComponent },
  { path: 'edit', component: EditDataComponent },
  { path: 'add', component: AddDataComponent },
  { path: '**', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

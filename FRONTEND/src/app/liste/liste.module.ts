import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ListeComponent } from './liste.component';

const routes: Routes = [
  { 
    path: '', 
    component: ListeComponent 
  },
  { path: '', redirectTo: 'liste', pathMatch: 'full' },
  { path: '**', redirectTo: 'liste' },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ListeComponent,
    RouterModule.forChild(routes)
  ]
})

export class ListModule {

}
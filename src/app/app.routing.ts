import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'manager', pathMatch: 'full' },
  { path: 'manager', loadChildren: 'app/components/manager/manager.module#ManagerModule'},
  { path: 'system-login', loadChildren: 'app/components/login/login.module#LoginModule'}
];

@NgModule({
  imports: [ RouterModule.forRoot(routes, { useHash: true }) ],
  exports: [ RouterModule ]
})
export class Routing {}

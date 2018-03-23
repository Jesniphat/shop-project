import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManagerGuard } from './_guards/manager.guard';

const routes: Routes = [
  { path: '', redirectTo: 'global', pathMatch: 'full' },
  { path: 'global', loadChildren: 'app/components/global/global.module#GlobalModule'},
  { path: 'manager', loadChildren: 'app/components/manager/manager.module#ManagerModule', canActivate: [ManagerGuard]},
  { path: 'system-login', loadChildren: 'app/components/login/login.module#LoginModule'}
];

@NgModule({
  imports: [ RouterModule.forRoot(routes, { useHash: true }) ],
  exports: [ RouterModule ]
})
export class Routing {}

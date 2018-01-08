import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManagerComponent } from './manager.component';

import { ManagerDashboardComponent } from './dashboard/manager-dashboard/manager-dashboard.component';
import { CategoryListComponent } from './category/category-list/category-list.component';
import { CategoryManagerComponent } from './category/category-manager/category-manager.component';
import { ProductListComponent } from './product/product-list/product-list.component';
import { ProductManagerComponent } from './product/product-manager/product-manager.component';
import { StaffCreateComponent } from './setting/staff-create/staff-create.component';
import { StaffEditComponent } from './setting/staff-edit/staff-edit.component';

const routes: Routes = [
  { path: 'manager', component: ManagerComponent, children: [
    { path: '', redirectTo: '/manager/(m:dashboard)', pathMatch: 'full' },
    { path: 'dashboard', component: ManagerDashboardComponent, outlet: 'm' },
    { path: 'category', component: CategoryListComponent, outlet: 'm' },
    { path: 'category-manager/:id', component: CategoryManagerComponent, outlet: 'm' },
    { path: 'product', component: ProductListComponent, outlet: 'm'},
    { path: 'product-manager/:id', component: ProductManagerComponent, outlet: 'm'},
    { path: 'create-staff', component: StaffCreateComponent, outlet: 'm'},
    { path: 'create-edit', component: StaffEditComponent, outlet: 'm'}
  ]}
];

@NgModule({
  imports: [ RouterModule.forRoot(routes, { useHash: true }) ],
  exports: [RouterModule]
})
export class Routing { }

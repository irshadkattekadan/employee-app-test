import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { EmployeeAddComponent } from './employee-add/employee-add.component';

const routes: Routes = [
  {
    path: '',
    component: EmployeeListComponent,
    data: { title: 'Employee List' }
  },
  {
    path: 'add',
    component: EmployeeAddComponent,
    data: { title: 'Add Employee Details' }
  },
  {
    path: 'edit/:id',
    component: EmployeeAddComponent,
    data: { title: 'Edit Employee Details' }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 

}

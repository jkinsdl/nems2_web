import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from '../../layout/dashboard/dashboard.component';
import { DashboardResolver } from '../../layout/dashboard/dashboard.resolver';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    resolve: {
      resolvedData: DashboardResolver, // Use a different property name for resolved data
    },
  },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  providers: [DashboardResolver],
})
export class DashboardModule {}



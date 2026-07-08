import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { AdminDashboardComponent } from './pages/dashboards/admin-dashboard/admin-dashboard.component';
import { PMDashboardComponent } from './pages/dashboards/pm-dashboard/pm-dashboard.component';
import { EngineerDashboardComponent } from './pages/dashboards/engineer-dashboard/engineer-dashboard.component';
import { ContractorDashboardComponent } from './pages/dashboards/contractor-dashboard/contractor-dashboard.component';
import { ClientDashboardComponent } from './pages/dashboards/client-dashboard/client-dashboard.component';
import { WorkerDashboardComponent } from './pages/dashboards/worker-dashboard/worker-dashboard.component';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  
  // Administrator dashboard
  { 
    path: 'admin-dashboard', 
    component: AdminDashboardComponent, 
    canActivate: [AuthGuard], 
    data: { roles: ['Administrator'] } 
  },
  
  // PM dashboard (allowed: Administrator, Project_Manager)
  { 
    path: 'pm-dashboard', 
    component: PMDashboardComponent, 
    canActivate: [AuthGuard], 
    data: { roles: ['Administrator', 'Project_Manager'] } 
  },
  
  // Engineer dashboard (allowed: Administrator, Site_Engineer)
  { 
    path: 'engineer-dashboard', 
    component: EngineerDashboardComponent, 
    canActivate: [AuthGuard], 
    data: { roles: ['Administrator', 'Site_Engineer'] } 
  },
  
  // Contractor dashboard (allowed: Administrator, Contractor)
  { 
    path: 'contractor-dashboard', 
    component: ContractorDashboardComponent, 
    canActivate: [AuthGuard], 
    data: { roles: ['Administrator', 'Contractor'] } 
  },
  
  // Client dashboard (allowed: Administrator, Client)
  { 
    path: 'client-dashboard', 
    component: ClientDashboardComponent, 
    canActivate: [AuthGuard], 
    data: { roles: ['Administrator', 'Client'] } 
  },
  
  // Worker dashboard (allowed: Administrator, Worker)
  { 
    path: 'worker-dashboard', 
    component: WorkerDashboardComponent, 
    canActivate: [AuthGuard], 
    data: { roles: ['Administrator', 'Worker'] } 
  },
  
  // Catch all redirects
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

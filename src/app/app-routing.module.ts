import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { LoginComponent } from './component/login/login.component';
import { AlarmComponent } from './layout/alarm/alarm.component';
import { ControlPanelComponent } from './layout/control-panel/control-panel.component';
import { DatectErrorComponent } from './layout/control-panel/datect-error/datect-error.component';
import { OTAInformationComponent } from './layout/control-panel/otainformation/otainformation.component';
import { OTAManagementComponent } from './layout/control-panel/otamanagement/otamanagement.component';
import { PublicPlatformForSpecificPeriodComponent } from './layout/control-panel/public-platform/public-platform-for-specific-period/public-platform-for-specific-period.component';
import { PublicPlatformManagementComponent } from './layout/control-panel/public-platform/public-platform-management/public-platform-management.component';
import { PublicPlatformComponent } from './layout/control-panel/public-platform/public-platform.component';
import { PushAlarmComponent } from './layout/control-panel/push-alarm/push-alarm.component';
import { ConfigureComponent } from './layout/control-panel/remote-control/configure/configure.component';
import { RemoteControlStateComponent } from './layout/control-panel/remote-control/remote-control-state/remote-control-state.component';
import { RemoteControlComponent } from './layout/control-panel/remote-control/remote-control.component';
import { ServerLogsComponent } from './layout/control-panel/server-logs/server-logs.component';
import { TerminalComponent } from './layout/control-panel/terminal/terminal.component';
import { UserAccountComponent } from './layout/control-panel/user-account/user-account.component';
import { VehicleModelComponent } from './layout/control-panel/vehicle/vehicle-model/vehicle-model.component';
import { VehicleSettingsComponent } from './layout/control-panel/vehicle/vehicle-settings/vehicle-settings.component';
import { VehicleComponent } from './layout/control-panel/vehicle/vehicle.component';
//import { DashboardComponent } from './layout/dashboard/dashboard.component';
import { DetailMonitoringComponent } from './layout/monitoring/detail-monitoring/detail-monitoring.component';
import { MonitoringComponent } from './layout/monitoring/monitoring.component';
import { MonthlyVehicleStatisticsComponent } from './layout/statistics/monthly-vehicle-statistics/monthly-vehicle-statistics.component';
import { StatisticsComponent } from './layout/statistics/statistics.component';
import { StatusComponent } from './layout/status/status.component';
import { TravelDistanceStatisticsComponent } from './layout/statistics/travel-distance-statistics/travel-distance-statistics.component';
import { UserChargingPatternAnalysisComponent } from './layout/statistics/user-charging-pattern-analysis/user-charging-pattern-analysis.component';
import { WarningStatisticsComponent } from './layout/statistics/warning-statistics/warning-statistics.component';
import { MainComponent } from './main/main.component';
//import { MainRoutingModule } from './main/main-routing.module';
import { AuthGuard } from './shared/guard/auth.guard';
import { MileageJumpComponent } from './layout/control-panel/datect-error/mileage-jump/mileage-jump.component';
import { LocationJumpComponent } from './layout/control-panel/datect-error/location-jump/location-jump.component';
import { AbnormalVehicleStateComponent } from './layout/control-panel/datect-error/abnormal-vehicle-state/abnormal-vehicle-state.component';
import { DashboardComponent } from './layout/dashboard/dashboard.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'main', component: MainComponent, children:[
    //{ path: 'dashboard', loadChildren: () => import('./layout/dashboard/dashboard.module').then(m => m.DashboardModule) },
    { path: 'dashboard', component: DashboardComponent },
  //{ path: 'main', loadChildren: () => import('./main/main.module').then(m => m.MainModule) },
    // { path: 'dashboard', component: DashboardComponent },
    { path: 'monitoring', canActivate: [AuthGuard], component: MonitoringComponent },
    { path: 'monitoring/detail/:vin', canActivate: [AuthGuard], component: DetailMonitoringComponent },
    { path: 'status', canActivate: [AuthGuard], component: StatusComponent },
    { path: 'statistics', canActivate: [AuthGuard], component: StatisticsComponent, children:[
      {path:'warningStatistics', canActivate: [AuthGuard], component:WarningStatisticsComponent},
      {path:'monthlyVehicleStatistics', canActivate: [AuthGuard], component:MonthlyVehicleStatisticsComponent},
      {path:'userChargingPatternAnalysis', canActivate: [AuthGuard], component:UserChargingPatternAnalysisComponent},
      {path:'travelDistanceStatistics', canActivate: [AuthGuard], component:TravelDistanceStatisticsComponent}
    ]},
    { path: 'alarm', canActivate: [AuthGuard], component:AlarmComponent},
    { path: 'alarm/:issueId/:warningLevel', canActivate: [AuthGuard], component:AlarmComponent},
    { path: 'control', canActivate: [AuthGuard], component: ControlPanelComponent, children:[
      { path: 'userAccount', canActivate: [AuthGuard], component: UserAccountComponent },
      { path: 'vehicle', canActivate: [AuthGuard], component: VehicleComponent, children :[
        { path: 'vehicleSettings', canActivate: [AuthGuard], component: VehicleSettingsComponent },
        { path: 'vehicleModel', canActivate: [AuthGuard], component: VehicleModelComponent },
      ]},
      { path: 'publicPlatform', canActivate: [AuthGuard], component: PublicPlatformComponent, children:[
        { path: 'publicPlatformManagement', canActivate: [AuthGuard], component: PublicPlatformManagementComponent },
        { path: 'publicPlatformForSpecificPeriod', canActivate: [AuthGuard], component: PublicPlatformForSpecificPeriodComponent },
      ]},
      { path: 'serverLogs', canActivate: [AuthGuard], component: ServerLogsComponent },
      { path: 'otaInformation', canActivate: [AuthGuard], component: OTAInformationComponent },
      { path: 'terminal', canActivate: [AuthGuard], component: TerminalComponent },
      { path: 'remoteControl', canActivate: [AuthGuard], component: RemoteControlComponent, children:[
        {path : 'state', canActivate: [AuthGuard], component:RemoteControlStateComponent},
        {path : 'configure', canActivate: [AuthGuard], component:ConfigureComponent}
      ]},
      { path: 'otaManagement', canActivate: [AuthGuard], component: OTAManagementComponent },
      { path: 'pushAlarm', canActivate: [AuthGuard], component: PushAlarmComponent },
      { path: 'detectError', canActivate: [AuthGuard], component: DatectErrorComponent, children:[
        {path : 'abnormalVehicleState', canActivate: [AuthGuard], component:AbnormalVehicleStateComponent},
        {path : 'locationJump', canActivate: [AuthGuard], component:LocationJumpComponent},
        {path : 'mileageJump', canActivate: [AuthGuard], component:MileageJumpComponent},
      ]},
    ]},
  ]},
];

@NgModule({

  imports: [RouterModule.forRoot(routes, { useHash : true })],

  /*imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, useHash: true })
  ],*/
  exports: [RouterModule]
})
export class AppRoutingModule { }


 
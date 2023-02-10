import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './component/login/login.component';
import { AbnormalLocationVehicleComponent } from './layout/abnormal-location-vehicle/abnormal-location-vehicle.component';
import { Test1Component } from './layout/abnormal-location-vehicle/test1/test1.component';
import { Test2Component } from './layout/abnormal-location-vehicle/test2/test2.component';
import { AlarmHistoryComponent } from './layout/alarm-history/alarm-history.component';
import { AlarmComponent } from './layout/alarm/alarm.component';
import { ControlPanelComponent } from './layout/control-panel/control-panel.component';
import { AbnormalVehicleHistoryComponent } from './layout/control-panel/datect-error/abnormal-vehicle-history/abnormal-vehicle-history.component';
import { AbnormalVehicleRealTimeComponent } from './layout/control-panel/datect-error/abnormal-vehicle-real-time/abnormal-vehicle-real-time.component';
import { DatectErrorComponent } from './layout/control-panel/datect-error/datect-error.component';
import { OfflineVehicleHistoryComponent } from './layout/control-panel/datect-error/offline-vehicle-history/offline-vehicle-history.component';
import { OfflineVehicleRealTimeComponent } from './layout/control-panel/datect-error/offline-vehicle-real-time/offline-vehicle-real-time.component';
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
import { ShanghaiInfoComponent } from './layout/control-panel/shanghai-info/shanghai-info.component';
import { TerminalComponent } from './layout/control-panel/terminal/terminal.component';
import { UserAccountComponent } from './layout/control-panel/user-account/user-account.component';
import { VehicleModelComponent } from './layout/control-panel/vehicle/vehicle-model/vehicle-model.component';
import { VehicleSettingsComponent } from './layout/control-panel/vehicle/vehicle-settings/vehicle-settings.component';
import { VehicleComponent } from './layout/control-panel/vehicle/vehicle.component';
import { DashboardComponent } from './layout/dashboard/dashboard.component';
import { DataForwardingComponent } from './layout/data-forwarding/data-forwarding.component';
import { FailureComponent } from './layout/failure/failure.component';
import { DetailMonitoringComponent } from './layout/monitoring/detail-monitoring/detail-monitoring.component';
import { MonitoringDetailZoomComponent } from './layout/monitoring/detail-monitoring/monitoring-detail-zoom/monitoring-detail-zoom.component';
import { MonitoringEngineComponent } from './layout/monitoring/detail-monitoring/monitoring-engine/monitoring-engine.component';
import { MonitoringExtremeValueComponent } from './layout/monitoring/detail-monitoring/monitoring-extreme-value/monitoring-extreme-value.component';
import { MonitoringFuelBatteryComponent } from './layout/monitoring/detail-monitoring/monitoring-fuel-battery/monitoring-fuel-battery.component';
import { MonitoringLocationComponent } from './layout/monitoring/detail-monitoring/monitoring-location/monitoring-location.component';
import { MonitoringMotorComponent } from './layout/monitoring/detail-monitoring/monitoring-motor/monitoring-motor.component';
import { MonitoringPowerBatteryInfomationComponent } from './layout/monitoring/detail-monitoring/monitoring-power-battery-infomation/monitoring-power-battery-infomation.component';
import { MonitoringPowerBatteryTemperatureComponent } from './layout/monitoring/detail-monitoring/monitoring-power-battery-temperature/monitoring-power-battery-temperature.component';
import { MonitoringVehicleComponent } from './layout/monitoring/detail-monitoring/monitoring-vehicle/monitoring-vehicle.component';
import { MonitoringWarningComponent } from './layout/monitoring/detail-monitoring/monitoring-warning/monitoring-warning.component';
import { MonitoringComponent } from './layout/monitoring/monitoring.component';
import { MonthlyVehicleStatisticsComponent } from './layout/statistics/monthly-vehicle-statistics/monthly-vehicle-statistics.component';
import { DrivingChargingStatisticsComponent } from './layout/statistics/driving-charging-statistics/driving-charging-statistics.component';
import { SearchDataComponent } from './layout/statistics/search-data/search-data.component';
import { SingleStatisticsComponent } from './layout/statistics/single-statistics/single-statistics.component';
import { StatisticsComponent } from './layout/statistics/statistics.component';
import { TotalStatisticsComponent } from './layout/statistics/total-statistics/total-statistics.component';
import { StatusComponent } from './layout/status/status.component';
import { TravelDistanceStatisticsComponent } from './layout/statistics/travel-distance-statistics/travel-distance-statistics.component';
import { UserChargingPatternAnalysisComponent } from './layout/statistics/user-charging-pattern-analysis/user-charging-pattern-analysis.component';
import { WarningStatisticsComponent } from './layout/statistics/warning-statistics/warning-statistics.component';
import { MainComponent } from './main/main.component';
import { AuthGuard } from './shared/guard/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'main', component: MainComponent, children:[
    { path: 'dashboard', component: DashboardComponent },
    { path: 'monitoring', canActivate: [AuthGuard], component: MonitoringComponent },
    { path: 'monitoring/detail', canActivate: [AuthGuard], component: DetailMonitoringComponent },
    { path: 'monitoring/detail/zoom', canActivate: [AuthGuard], component: MonitoringDetailZoomComponent, children:[
      { path: 'vehicle', canActivate: [AuthGuard], component: MonitoringVehicleComponent },
      { path: 'location', canActivate: [AuthGuard], component: MonitoringLocationComponent },
      { path: 'engine', canActivate: [AuthGuard], component: MonitoringEngineComponent },
      { path: 'fuel_battery', canActivate: [AuthGuard], component: MonitoringFuelBatteryComponent },
      { path: 'warning', canActivate: [AuthGuard], component: MonitoringWarningComponent },
      { path: 'extreme_value', canActivate: [AuthGuard], component: MonitoringExtremeValueComponent },
      { path: 'motor', canActivate: [AuthGuard], component: MonitoringMotorComponent },
      { path: 'power_battery_temperature', canActivate: [AuthGuard], component: MonitoringPowerBatteryTemperatureComponent },
      { path: 'power_battery_infomation', canActivate: [AuthGuard], component: MonitoringPowerBatteryInfomationComponent },
    ]},
    { path: 'status', canActivate: [AuthGuard], component: StatusComponent },
    { path: 'statistics', canActivate: [AuthGuard], component: StatisticsComponent, children:[
      { path: 'total', canActivate: [AuthGuard], component: TotalStatisticsComponent },
      { path: 'driving', canActivate: [AuthGuard], component: DrivingChargingStatisticsComponent },
      { path: 'single', canActivate: [AuthGuard], component: SingleStatisticsComponent },
      { path: 'search', canActivate: [AuthGuard], component: SearchDataComponent },
      {path:'warningStatistics', canActivate: [AuthGuard], component:WarningStatisticsComponent},
      {path:'monthlyVehicleStatistics', canActivate: [AuthGuard], component:MonthlyVehicleStatisticsComponent},
      {path:'userChargingPatternAnalysis', canActivate: [AuthGuard], component:UserChargingPatternAnalysisComponent},
      {path:'travelDistanceStatistics', canActivate: [AuthGuard], component:TravelDistanceStatisticsComponent}
    ]},
    { path: 'failure', canActivate: [AuthGuard], component: FailureComponent },
    { path: 'alarm', canActivate: [AuthGuard], component:AlarmComponent},
    { path: 'history', canActivate: [AuthGuard], component:AlarmHistoryComponent},
    { path: 'abnormalLocationVehicle', canActivate: [AuthGuard], component:AbnormalLocationVehicleComponent, children:[
      {path : 'test1', canActivate: [AuthGuard], component:Test1Component},
      {path : 'test2', canActivate: [AuthGuard], component:Test2Component}
    ]},
    {path:'dataForwarding', canActivate: [AuthGuard], component:DataForwardingComponent},

    /*{path:'warningStatistics', canActivate: [AuthGuard], component:WarningStatisticsComponent},
    {path:'monthlyVehicleStatistics', canActivate: [AuthGuard], component:MonthlyVehicleStatisticsComponent},
    {path:'userChargingPatternAnalysis', canActivate: [AuthGuard], component:UserChargingPatternAnalysisComponent},
    {path:'travelDistanceStatistics', canActivate: [AuthGuard], component:TravelDistanceStatisticsComponent},*/


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
      { path: 'shanghaiInfo', canActivate: [AuthGuard], component: ShanghaiInfoComponent },
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
        {path : 'abnormalVehicleRealTime', canActivate: [AuthGuard], component:AbnormalVehicleRealTimeComponent},
        {path : 'abnormalVehicleHistory', canActivate: [AuthGuard], component:AbnormalVehicleHistoryComponent},
        {path : 'offlineVehicleRealTime', canActivate: [AuthGuard], component:OfflineVehicleRealTimeComponent},
        {path : 'offlineVehicleHistory', canActivate: [AuthGuard], component:OfflineVehicleHistoryComponent}
      ]},
    ]},
  ]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash : true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }



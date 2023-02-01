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
import { PublicPlatformManagementComponent } from './layout/control-panel/public-platform-management/public-platform-management.component';
import { PushAlarmComponent } from './layout/control-panel/push-alarm/push-alarm.component';
import { RemoteControlComponent } from './layout/control-panel/remote-control/remote-control.component';
import { ServerLogsComponent } from './layout/control-panel/server-logs/server-logs.component';
import { ShanghaiInfoComponent } from './layout/control-panel/shanghai-info/shanghai-info.component';
import { TerminalComponent } from './layout/control-panel/terminal/terminal.component';
import { UserAccountComponent } from './layout/control-panel/user-account/user-account.component';
import { VehicleSettingsComponent } from './layout/control-panel/vehicle-settings/vehicle-settings.component';
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
import { DrivingChargingStatisticsComponent } from './layout/statistics/driving-charging-statistics/driving-charging-statistics.component';
import { SearchDataComponent } from './layout/statistics/search-data/search-data.component';
import { SingleStatisticsComponent } from './layout/statistics/single-statistics/single-statistics.component';
import { StatisticsComponent } from './layout/statistics/statistics.component';
import { TotalStatisticsComponent } from './layout/statistics/total-statistics/total-statistics.component';
import { StatusComponent } from './layout/status/status.component';
import { MainComponent } from './main/main.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'main', component: MainComponent, children:[
    { path: 'dashboard', component: DashboardComponent },
    { path: 'monitoring', component: MonitoringComponent },
    { path: 'monitoring/detail', component: DetailMonitoringComponent },
    { path: 'monitoring/detail/zoom', component: MonitoringDetailZoomComponent, children:[
      { path: 'vehicle', component: MonitoringVehicleComponent },
      { path: 'location', component: MonitoringLocationComponent },
      { path: 'engine', component: MonitoringEngineComponent },
      { path: 'fuel_battery', component: MonitoringFuelBatteryComponent },
      { path: 'warning', component: MonitoringWarningComponent },
      { path: 'extreme_value', component: MonitoringExtremeValueComponent },
      { path: 'motor', component: MonitoringMotorComponent },
      { path: 'power_battery_temperature', component: MonitoringPowerBatteryTemperatureComponent },
      { path: 'power_battery_infomation', component: MonitoringPowerBatteryInfomationComponent },
    ]},
    { path: 'status', component: StatusComponent },
    { path: 'statistics', component: StatisticsComponent, children:[
      { path: 'total', component: TotalStatisticsComponent },
      { path: 'driving', component: DrivingChargingStatisticsComponent },
      { path: 'single', component: SingleStatisticsComponent },
      { path: 'search', component: SearchDataComponent },
    ]},
    { path: 'failure', component: FailureComponent },
    { path: 'alarm', component:AlarmComponent},
    { path: 'history', component:AlarmHistoryComponent},
    { path: 'abnormalLocationVehicle', component:AbnormalLocationVehicleComponent, children:[
      {path : 'test1', component:Test1Component},
      {path : 'test2', component:Test2Component}
    ]},
    {path:'dataForwarding', component:DataForwardingComponent},
    { path: 'control', component: ControlPanelComponent, children:[
      { path: 'userAccount', component: UserAccountComponent },
      { path: 'vehicleSettings', component: VehicleSettingsComponent },
      { path: 'publicPlatformManagement', component: PublicPlatformManagementComponent },
      { path: 'shanghaiInfo', component: ShanghaiInfoComponent },
      { path: 'serverLogs', component: ServerLogsComponent },
      { path: 'otaInformation', component: OTAInformationComponent },
      { path: 'terminal', component: TerminalComponent },
      { path: 'remoteControl', component: RemoteControlComponent },
      { path: 'otaManagement', component: OTAManagementComponent },
      { path: 'pushAlarm', component: PushAlarmComponent },
      { path: 'detectError', component: DatectErrorComponent, children:[
        {path : 'abnormalVehicleRealTime', component:AbnormalVehicleRealTimeComponent},
        {path : 'abnormalVehicleHistory', component:AbnormalVehicleHistoryComponent},
        {path : 'offlineVehicleRealTime', component:OfflineVehicleRealTimeComponent},
        {path : 'offlineVehicleHistory', component:OfflineVehicleHistoryComponent}
      ]},
    ]},
  ]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash : true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }



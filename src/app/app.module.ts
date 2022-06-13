import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MonitoringComponent } from './layout/monitoring/monitoring.component';
import { StatusComponent } from './layout/status/status.component';
import { StatisticsComponent } from './layout/statistics/statistics.component';
import { FailureComponent } from './layout/failure/failure.component';
import { ControlPanelComponent } from './layout/control-panel/control-panel.component';
import { TotalStatisticsComponent } from './layout/statistics/total-statistics/total-statistics.component';
import { DrivingChargingStatisticsComponent } from './layout/statistics/driving-charging-statistics/driving-charging-statistics.component';
import { SingleStatisticsComponent } from './layout/statistics/single-statistics/single-statistics.component';
import { SearchDataComponent } from './layout/statistics/search-data/search-data.component';
import { UserAccountComponent } from './layout/control-panel/user-account/user-account.component';
import { VehicleSettingsComponent } from './layout/control-panel/vehicle-settings/vehicle-settings.component';
import { PublicPlatformManagementComponent } from './layout/control-panel/public-platform-management/public-platform-management.component';
import { ShanghaiInfoComponent } from './layout/control-panel/shanghai-info/shanghai-info.component';
import { ServerLogsComponent } from './layout/control-panel/server-logs/server-logs.component';
import { OTAInformationComponent } from './layout/control-panel/otainformation/otainformation.component';
import { TerminalComponent } from './layout/control-panel/terminal/terminal.component';
import { RemoteControlComponent } from './layout/control-panel/remote-control/remote-control.component';
import { OTAManagementComponent } from './layout/control-panel/otamanagement/otamanagement.component';
import { PushAlarmComponent } from './layout/control-panel/push-alarm/push-alarm.component';
import { DatectErrorComponent } from './layout/control-panel/datect-error/datect-error.component';
import { LoginComponent } from './component/login/login.component';
import { MainComponent } from './main/main.component';
import { DashboardComponent } from './layout/dashboard/dashboard.component';
import { MatSelectModule,} from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SubTitleComponent } from './component/sub-title/sub-title.component';
import { NgChartsModule } from 'ng2-charts';
import { CreateStatisticsPlanComponent } from './component/create-statistics-plan/create-statistics-plan.component';
import { MatDialogModule } from '@angular/material/dialog';
import { PlayStatisticsPlanComponent } from './component/play-statistics-plan/play-statistics-plan.component';
import { NgxNativeDateModule, NgxMatDatetimePickerModule, NgxMatTimepickerModule, NgxMatNativeDateModule, NgxMatDateFormats, NGX_MAT_DATE_FORMATS } from '@angular-material-components/datetime-picker';
import { MatNativeDateModule } from '@angular/material/core';
import { NgxMatMomentModule } from '@angular-material-components/moment-adapter';
import { AgGridModule } from 'ag-grid-angular';
import { AddUserComponent } from './component/add-user/add-user.component';
import { AlertPopupComponent } from './component/alert-popup/alert-popup.component';
import { AddVehicleComponent } from './component/add-vehicle/add-vehicle.component';
import { AddPublicPlatformManagementComponent } from './component/add-public-platform-management/add-public-platform-management.component';
import { AddPublicPlatformMappingComponent } from './component/add-public-platform-mapping/add-public-platform-mapping.component';
import { AddPushAlarmComponent } from './component/add-push-alarm/add-push-alarm.component';
import { WarningIssueComponent } from './component/warning-issue/warning-issue.component';
import { DetailMonitoringComponent } from './layout/monitoring/detail-monitoring/detail-monitoring.component';
import { MonitoringVehicleComponent } from './layout/monitoring/detail-monitoring/monitoring-vehicle/monitoring-vehicle.component';
import { MonitoringLocationComponent } from './layout/monitoring/detail-monitoring/monitoring-location/monitoring-location.component';
import { MonitoringEngineComponent } from './layout/monitoring/detail-monitoring/monitoring-engine/monitoring-engine.component';
import { MonitoringFuelBatteryComponent } from './layout/monitoring/detail-monitoring/monitoring-fuel-battery/monitoring-fuel-battery.component';
import { MonitoringWarningComponent } from './layout/monitoring/detail-monitoring/monitoring-warning/monitoring-warning.component';
import { MonitoringExtremeValueComponent } from './layout/monitoring/detail-monitoring/monitoring-extreme-value/monitoring-extreme-value.component';
import { MonitoringMotorComponent } from './layout/monitoring/detail-monitoring/monitoring-motor/monitoring-motor.component';
import { MonitoringPowerBatteryTemperatureComponent } from './layout/monitoring/detail-monitoring/monitoring-power-battery-temperature/monitoring-power-battery-temperature.component';
import { MonitoringPowerBatteryInfomationComponent } from './layout/monitoring/detail-monitoring/monitoring-power-battery-infomation/monitoring-power-battery-infomation.component';
import { MonitoringDetailZoomComponent } from './layout/monitoring/detail-monitoring/monitoring-detail-zoom/monitoring-detail-zoom.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { HttpClientModule } from '@angular/common/http';
import { LeafletMarkerClusterModule } from '@asymmetrik/ngx-leaflet-markercluster';


const CUSTOM_DATE_FORMATS: NgxMatDateFormats = {
  parse: {
    dateInput: 'l, LTS'
  },
  display: {
    dateInput: 'YYYY-MM-DD HH:mm:ss',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  }
};

@NgModule({
  declarations: [
    AppComponent,
    MonitoringComponent,
    StatusComponent,
    StatisticsComponent,
    FailureComponent,
    ControlPanelComponent,
    TotalStatisticsComponent,
    DrivingChargingStatisticsComponent,
    SingleStatisticsComponent,
    SearchDataComponent,
    VehicleSettingsComponent,
    PublicPlatformManagementComponent,
    ShanghaiInfoComponent,
    ServerLogsComponent,
    OTAInformationComponent,
    TerminalComponent,
    RemoteControlComponent,
    OTAManagementComponent,
    PushAlarmComponent,
    DatectErrorComponent,
    UserAccountComponent,
    LoginComponent,
    MainComponent,
    DashboardComponent,
    SubTitleComponent,
    CreateStatisticsPlanComponent,
    PlayStatisticsPlanComponent,
    AddUserComponent,
    AlertPopupComponent,
    AddVehicleComponent,
    AddPublicPlatformManagementComponent,
    AddPublicPlatformMappingComponent,
    AddPushAlarmComponent,
    WarningIssueComponent,
    DetailMonitoringComponent,
    MonitoringVehicleComponent,
    MonitoringLocationComponent,
    MonitoringEngineComponent,
    MonitoringFuelBatteryComponent,
    MonitoringWarningComponent,
    MonitoringExtremeValueComponent,
    MonitoringMotorComponent,
    MonitoringPowerBatteryTemperatureComponent,
    MonitoringPowerBatteryInfomationComponent,
    MonitoringDetailZoomComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    MatSelectModule,
    BrowserAnimationsModule,
    NgChartsModule,
    MatDialogModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxNativeDateModule,
    MatNativeDateModule,
    NgxMatNativeDateModule,
    NgxMatMomentModule,
    AgGridModule,
    LeafletModule,
    HttpClientModule,
    LeafletMarkerClusterModule
  ],
  providers: [
    {provide: NGX_MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }


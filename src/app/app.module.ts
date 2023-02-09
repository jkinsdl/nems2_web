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
import { VehicleSettingsComponent } from './layout/control-panel/vehicle/vehicle-settings/vehicle-settings.component';
import { PublicPlatformManagementComponent } from './layout/control-panel/public-platform/public-platform-management/public-platform-management.component';
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
import { AlarmComponent } from './layout/alarm/alarm.component';
import { AlarmHistoryComponent } from './layout/alarm-history/alarm-history.component';
import { AbnormalLocationVehicleComponent } from './layout/abnormal-location-vehicle/abnormal-location-vehicle.component';
import { Test1Component } from './layout/abnormal-location-vehicle/test1/test1.component';
import { Test2Component } from './layout/abnormal-location-vehicle/test2/test2.component';
import { MapMarkerDetailComponent } from './layout/dashboard/map-marker-detail/map-marker-detail.component';
import { DataForwardingComponent } from './layout/data-forwarding/data-forwarding.component';
import { MapMarkerDetailVehicleInformationComponent } from './layout/dashboard/map-marker-detail/map-marker-detail-vehicle-information/map-marker-detail-vehicle-information.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NoopInterceptor } from './shared/intercept/noop-interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import {MatButtonModule} from '@angular/material/button';
import { AbnormalVehicleRealTimeComponent } from './layout/control-panel/datect-error/abnormal-vehicle-real-time/abnormal-vehicle-real-time.component';
import { AbnormalVehicleHistoryComponent } from './layout/control-panel/datect-error/abnormal-vehicle-history/abnormal-vehicle-history.component';
import { OfflineVehicleRealTimeComponent } from './layout/control-panel/datect-error/offline-vehicle-real-time/offline-vehicle-real-time.component';
import { OfflineVehicleHistoryComponent } from './layout/control-panel/datect-error/offline-vehicle-history/offline-vehicle-history.component';
import { AddOTAManagementComponent } from './component/add-otamanagement/add-otamanagement.component';
import { UploadOTAManagementComponent } from './component/upload-otamanagement/upload-otamanagement.component';
import { MatTabsModule } from '@angular/material/tabs';
import { NgTerminalModule } from 'ng-terminal';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RemoteControlStateComponent } from './layout/control-panel/remote-control/remote-control-state/remote-control-state.component';
import { ConfigureComponent } from './layout/control-panel/remote-control/configure/configure.component';
import { AddRegisterRemoteSettingComponent } from './component/add-register-remote-setting/add-register-remote-setting.component';
import { AddRemoteParameterConfigurationInfoComponent } from './component/add-remote-parameter-configuration-info/add-remote-parameter-configuration-info.component';
import { MatIconModule } from '@angular/material/icon';
import { PublicPlatformForSpecificPeriodComponent } from './layout/control-panel/public-platform/public-platform-for-specific-period/public-platform-for-specific-period.component';
import { PublicPlatformComponent } from './layout/control-panel/public-platform/public-platform.component';
import { VehicleModelComponent } from './layout/control-panel/vehicle/vehicle-model/vehicle-model.component';
import { VehicleComponent } from './layout/control-panel/vehicle/vehicle.component';
import { AddVehicleModelComponent } from './component/add-vehicle-model/add-vehicle-model.component'
import { OnlyNumber } from './shared/directive/onlynumber.directive';
import { BatteryDetailComponent } from './component/battery-detail/battery-detail.component';
import { WarningStatisticsComponent } from './layout/warning-statistics/warning-statistics.component';
import { MonthlyVehicleStatisticsComponent } from './layout/monthly-vehicle-statistics/monthly-vehicle-statistics.component';
import { UserChargingPatternAnalysisComponent } from './layout/user-charging-pattern-analysis/user-charging-pattern-analysis.component';
import { TravelDistanceStatisticsComponent } from './layout/travel-distance-statistics/travel-distance-statistics.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';

const CUSTOM_DATE_FORMATS: NgxMatDateFormats = {
  parse: {
    dateInput: 'l, LTS'
  },
  display: {
    dateInput: 'YYYY-MM-DD HH:mm',
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
    AlarmComponent,
    AlarmHistoryComponent,
    AbnormalLocationVehicleComponent,
    Test1Component,
    Test2Component,
    MapMarkerDetailComponent,
    DataForwardingComponent,
    MapMarkerDetailVehicleInformationComponent,
    AbnormalVehicleRealTimeComponent,
    AbnormalVehicleHistoryComponent,
    OfflineVehicleRealTimeComponent,
    OfflineVehicleHistoryComponent,
    AddOTAManagementComponent,
    UploadOTAManagementComponent,
    RemoteControlStateComponent,
    ConfigureComponent,
    AddRegisterRemoteSettingComponent,
    AddRemoteParameterConfigurationInfoComponent,
    PublicPlatformForSpecificPeriodComponent,
    PublicPlatformComponent,
    VehicleModelComponent,
    VehicleComponent,
    AddVehicleModelComponent,
    OnlyNumber,
    BatteryDetailComponent,
    WarningStatisticsComponent,
    MonthlyVehicleStatisticsComponent,
    UserChargingPatternAnalysisComponent,
    TravelDistanceStatisticsComponent
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
    LeafletMarkerClusterModule,
    DragDropModule,
    MatButtonModule,
    MatTabsModule,
    NgTerminalModule,
    MatFormFieldModule,
    MatCardModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSlideToggleModule,
    MatIconModule,
    MatProgressBarModule
  ],
  providers: [
    {provide: NGX_MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS},
    { provide: HTTP_INTERCEPTORS, useClass: NoopInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }


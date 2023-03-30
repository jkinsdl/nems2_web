import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MonitoringComponent } from './layout/monitoring/monitoring.component';
import { StatusComponent } from './layout/status/status.component';
import { StatisticsComponent } from './layout/statistics/statistics.component';
import { ControlPanelComponent } from './layout/control-panel/control-panel.component';
import { UserAccountComponent } from './layout/control-panel/user-account/user-account.component';
import { VehicleSettingsComponent } from './layout/control-panel/vehicle/vehicle-settings/vehicle-settings.component';
import { PublicPlatformManagementComponent } from './layout/control-panel/public-platform/public-platform-management/public-platform-management.component';
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
import { MatDialogModule } from '@angular/material/dialog';
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
import { DetailMonitoringComponent } from './layout/monitoring/detail-monitoring/detail-monitoring.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { HttpClientModule } from '@angular/common/http';
import { LeafletMarkerClusterModule } from '@asymmetrik/ngx-leaflet-markercluster';
import { AlarmComponent } from './layout/alarm/alarm.component';
import { MapMarkerDetailComponent } from './layout/dashboard/map-marker-detail/map-marker-detail.component';
import { MapMarkerDetailVehicleInformationComponent } from './layout/dashboard/map-marker-detail/map-marker-detail-vehicle-information/map-marker-detail-vehicle-information.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NoopInterceptor } from './shared/intercept/noop-interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import {MatButtonModule} from '@angular/material/button';
import { AddOTAManagementComponent } from './component/add-otamanagement/add-otamanagement.component';
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
import { WarningStatisticsComponent } from './layout/statistics/warning-statistics/warning-statistics.component';
import { MonthlyVehicleStatisticsComponent } from './layout/statistics/monthly-vehicle-statistics/monthly-vehicle-statistics.component';
import { UserChargingPatternAnalysisComponent } from './layout/statistics/user-charging-pattern-analysis/user-charging-pattern-analysis.component';
import { TravelDistanceStatisticsComponent } from './layout/statistics/travel-distance-statistics/travel-distance-statistics.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DateformatPipe } from './shared/pipes/dateformat.pipe';
import { GridTooltipComponent } from './component/grid-tooltip/grid-tooltip.component';
import { InfoDetailComponent } from './component/info-detail/info-detail.component';
import { GridPageComponent } from './component/grid-page/grid-page.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CheckboxFilterComponent } from './component/checkbox-filter/checkbox-filter.component';
import { BtnCellRendererComponent } from './component/btn-cell-renderer/btn-cell-renderer.component';
import { ToggleCellRendererComponent } from './component/toggle-cell-renderer/toggle-cell-renderer.component';
import { DetailServerLogComponent } from './component/detail-server-log/detail-server-log.component';
import { LocationJumpComponent } from './layout/control-panel/datect-error/location-jump/location-jump.component';
import { MileageJumpComponent } from './layout/control-panel/datect-error/mileage-jump/mileage-jump.component';
import { AbnormalVehicleStateComponent } from './layout/control-panel/datect-error/abnormal-vehicle-state/abnormal-vehicle-state.component';
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
    ControlPanelComponent,
    VehicleSettingsComponent,
    PublicPlatformManagementComponent,
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
    AddUserComponent,
    AlertPopupComponent,
    AddVehicleComponent,
    AddPublicPlatformManagementComponent,
    AddPublicPlatformMappingComponent,
    AddPushAlarmComponent,
    DetailMonitoringComponent,
    AlarmComponent,
    MapMarkerDetailComponent,
    MapMarkerDetailVehicleInformationComponent,
    AddOTAManagementComponent,
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
    TravelDistanceStatisticsComponent,
    DateformatPipe,
    GridTooltipComponent,
    InfoDetailComponent,
    GridPageComponent,
    CheckboxFilterComponent,
    BtnCellRendererComponent,
    ToggleCellRendererComponent,
    DetailServerLogComponent,
    LocationJumpComponent,
    MileageJumpComponent,
    AbnormalVehicleStateComponent
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
    MatProgressBarModule,
    MatCheckboxModule
  ],
  providers: [
    {provide: NGX_MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS},
    { provide: HTTP_INTERCEPTORS, useClass: NoopInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }


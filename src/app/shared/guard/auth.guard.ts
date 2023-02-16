import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    public router: Router) { }

  canActivate(next: ActivatedRouteSnapshot,
      state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    // Guard for user is login or not
    let user = null
    if(localStorage && localStorage.getItem('user') != 'undefined'){
      user = JSON.parse(localStorage.getItem('user'));
    }

    if (!user || user === null) {
      this.router.navigate(['/login']);
      return true
    } else if (user) {
      if (!Object.keys(user).length) {
        this.router.navigate(['/login']);
        return true
      }

      if(user.authorityId == "root" || user.authorityId == "admin"){

        if(state.url.indexOf('/dashboard') < 0 &&
        state.url.indexOf('/monitoring') < 0 &&
        state.url.indexOf('/status') < 0 &&
        state.url.indexOf('/statistics') < 0 &&
        state.url.indexOf('/alarm') < 0 &&
        //state.url.indexOf('/history') < 0 &&
        //state.url.indexOf('/abnormalLocationVehicle') < 0 &&
        //state.url.indexOf('/dataForwarding') < 0 &&
        //state.url.indexOf('/warningStatistics') < 0 &&
        //state.url.indexOf('/monthlyVehicleStatistics') < 0 &&
        //state.url.indexOf('/userChargingPatternAnalysis') < 0 &&
        //state.url.indexOf('/travelDistanceStatistics') < 0 &&
        state.url.indexOf('/control/userAccount') < 0 &&
        state.url.indexOf('/control/vehicle/vehicleSettings') < 0 &&
        state.url.indexOf('/control/vehicle/vehicleModel') < 0 &&
        state.url.indexOf('/control/publicPlatform/publicPlatformManagement') < 0 &&
        state.url.indexOf('/control/publicPlatform/publicPlatformForSpecificPeriod') < 0 &&
        state.url.indexOf('/control/serverLogs') < 0 &&
        state.url.indexOf('/control/otaInformation') < 0 &&
        state.url.indexOf('/control/remoteControl/state') < 0 &&
        state.url.indexOf('/control/remoteControl/configure') < 0 &&
        state.url.indexOf('/control/terminal') < 0 &&
        state.url.indexOf('/control/otaManagement') < 0 &&
        state.url.indexOf('/control/pushAlarm') < 0 &&
        state.url.indexOf('/control/detectError/abnormalVehicleRealTime') < 0 &&
        state.url.indexOf('/control/detectError/abnormalVehicleHistory') < 0 &&
        state.url.indexOf('/control/detectError/offlineVehicleRealTime') < 0 &&
        state.url.indexOf('/control/detectError/offlineVehicleHistory') < 0
        ){
          this.router.navigate(['/dashboard']);
          return true
        }

      }else if(user.authorityId == "service-admin"){

        if(state.url.indexOf('/dashboard') < 0 &&
        state.url.indexOf('/monitoring') < 0 &&
        state.url.indexOf('/status') < 0 &&
        state.url.indexOf('/statistics') < 0 &&
        state.url.indexOf('/alarm') < 0 &&
        //state.url.indexOf('/history') < 0 &&
        //state.url.indexOf('/abnormalLocationVehicle') < 0 &&
        //state.url.indexOf('/dataForwarding') < 0 &&
        state.url.indexOf('/control/vehicle/vehicleSettings') < 0 &&
        state.url.indexOf('/control/vehicle/vehicleModel') < 0 &&
        state.url.indexOf('/control/control/serverLogs') < 0 &&
        state.url.indexOf('/control/remoteControl/state') < 0 &&
        state.url.indexOf('/control/pushAlarm') < 0 &&
        state.url.indexOf('/control/detectError/abnormalVehicleRealTime') < 0 &&
        state.url.indexOf('/control/detectError/abnormalVehicleHistory') < 0 &&
        state.url.indexOf('/control/detectError/offlineVehicleRealTime') < 0 &&
        state.url.indexOf('/control/detectError/offlineVehicleHistory') < 0
        ){
          this.router.navigate(['/dashboard']);
          return true
        }

      }else if(user.authorityId == "poweruser"){

        if(state.url.indexOf('/dashboard') < 0 &&
        state.url.indexOf('/monitoring') < 0 &&
        state.url.indexOf('/status') < 0 &&
        state.url.indexOf('/statistics') < 0 &&
        state.url.indexOf('/alarm') < 0 &&
        //state.url.indexOf('/history') < 0 &&
        //state.url.indexOf('/abnormalLocationVehicle') < 0 &&
        state.url.indexOf('/control/pushAlarm') < 0 &&
        state.url.indexOf('/control/detectError/abnormalVehicleRealTime') < 0 &&
        state.url.indexOf('/control/detectError/abnormalVehicleHistory') < 0 &&
        state.url.indexOf('/control/detectError/offlineVehicleRealTime') < 0 &&
        state.url.indexOf('/control/detectError/offlineVehicleHistory') < 0
        ){
          this.router.navigate(['/dashboard']);
          return true
        }
      }else if(user.authorityId == "user"){
        if(state.url.indexOf('/dashboard') < 0 &&
        state.url.indexOf('/monitoring') < 0 &&
        state.url.indexOf('/alarm') < 0 /*&&
        state.url.indexOf('/history') < 0*/ ){
          this.router.navigate(['/dashboard']);
          return true
        }
      }
    }


    return true
  }

}

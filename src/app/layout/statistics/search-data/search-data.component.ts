import { Component, OnInit } from '@angular/core';
import { ColDef } from 'ag-grid-community';

@Component({
  selector: 'app-search-data',
  templateUrl: './search-data.component.html',
  styleUrls: ['./search-data.component.css']
})
export class SearchDataComponent implements OnInit {

  constructor() { }
  columnDefs: ColDef[] = [
    { field: 'vin' },
    { field: 'charged_energy', headerName: 'Charged Energy(kwh)'},
    { field: 'charged_count', headerName : 'Charged Count'},
    { field: 'daily_driving_time', headerName : 'Daily Driving Time(min)' },
    { field: 'daily_mileage', headerName : 'Daily Mileage(km)' },
    { field: 'daily_charging_time', headerName : 'Daily Charging Time(min)' },
    { field: 'daily_charged_energy', headerName : 'Daily Charged Energy(kwh)' },
    { field: 'daily_charge_count', headerName : 'Daily Charge Count' },
    { field: 'energy_efficiency', headerName : 'Energy Efficiency(kwh/100km)' },
    { field: 'start_date', headerName : 'Start Date' },
    { field: 'end_date', headerName : 'End Date' },
    { field: 'mileage', headerName : 'Mileage(km)' },
    { field: 'driving_count', headerName : 'Driving Count' },
    { field: 'driving_time', headerName : 'Driving Time(min)' },
    { field: 'consumed_energy', headerName : 'Consumed Energy(kwh)' },
    { field: 'fast_charge_count', headerName : 'Fast Charge Count' },
    { field: 'fast_charging_time', headerName : 'Fast Charged Energy(kwh)' },
    { field: 'slow_charge_count', headerName : 'Slow Charge Count' },
    { field: 'slow_charging_time', headerName : 'Slow Charging Time(min)' },
    { field: 'slow_charged_energy', headerName : 'Slow Charged Energy(kwh)' },
  ];

  rowData = [
      { vin: 'vin',
      charged_energy: 'Charged energy',
      charged_count: 'charged_count',
      daily_driving_time : 'daily_driving_time',
      daily_mileage : 'daily_mileage',
      daily_charging_time : 'daily_charging_time',
      daily_charged_energy : 'daily_charged_energy',
      daily_charge_count : 'daily_charge_count',
      energy_efficiency : 'energy_efficiency',
      start_date : 'start_date',
      end_date : 'end_date',
      mileage : 'mileage',
      driving_count : 'driving_count',
      driving_time : 'driving_time',
      consumed_energy : 'consumed_energy',
      fast_charge_count : 'fast_charge_count',
      fast_charging_time : 'fast_charging_time',
      slow_charge_count : 'slow_charge_count',
      slow_charging_time : 'slow_charging_time',
      slow_charged_energy : 'slow_charged_energy'
    },

    { vin: 'vin',
    charged_energy: 'Charged energy',
    charged_count: 'charged_count',
    daily_driving_time : 'daily_driving_time',
    daily_mileage : 'daily_mileage',
    daily_charging_time : 'daily_charging_time',
    daily_charged_energy : 'daily_charged_energy',
    daily_charge_count : 'daily_charge_count',
    energy_efficiency : 'energy_efficiency',
    start_date : 'start_date',
    end_date : 'end_date',
    mileage : 'mileage',
    driving_count : 'driving_count',
    driving_time : 'driving_time',
    consumed_energy : 'consumed_energy',
    fast_charge_count : 'fast_charge_count',
    fast_charging_time : 'fast_charging_time',
    slow_charge_count : 'slow_charge_count',
    slow_charging_time : 'slow_charging_time',
    slow_charged_energy : 'slow_charged_energy'
  },
  { vin: 'vin',
  charged_energy: 'Charged energy',
  charged_count: 'charged_count',
  daily_driving_time : 'daily_driving_time',
  daily_mileage : 'daily_mileage',
  daily_charging_time : 'daily_charging_time',
  daily_charged_energy : 'daily_charged_energy',
  daily_charge_count : 'daily_charge_count',
  energy_efficiency : 'energy_efficiency',
  start_date : 'start_date',
  end_date : 'end_date',
  mileage : 'mileage',
  driving_count : 'driving_count',
  driving_time : 'driving_time',
  consumed_energy : 'consumed_energy',
  fast_charge_count : 'fast_charge_count',
  fast_charging_time : 'fast_charging_time',
  slow_charge_count : 'slow_charge_count',
  slow_charging_time : 'slow_charging_time',
  slow_charged_energy : 'slow_charged_energy'
},
  ];

  ngOnInit(): void {
  }

}

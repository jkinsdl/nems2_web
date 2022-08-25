import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import mapboxgl from 'mapbox-gl';
@Component({
  selector: 'app-alarm',
  templateUrl: './alarm.component.html',
  styleUrls: ['./alarm.component.css']
})
export class AlarmComponent implements OnInit {

  constructor() {
   }

  columnDefs: ColDef[] = [
    {
      headerName: "",
      field:"checkBox",
      cellClass: 'cell-wrap-text',
      headerCheckboxSelection: true,
      checkboxSelection: true,
      width: 10
    },
    { field: 'header1',width: 150,
      minWidth: 150
    },
    { field: 'header2', minWidth:300},
    { field: 'header3', minWidth:150},
    { field: 'header4', minWidth:150},
    { field: 'header5', minWidth:150}
  ];

  rowData = [
    {
      header1: '1',
      header2: '2',
      header3: '3',
      header4 : '4',
      header5 : '5'
    },
    { header1: '1',
      header2: '2',
      header3: '3',
      header4 : '4',
      header5 : '5'
    },
    { header1: '1',
    header2: '2',
    header3: '3',
    header4 : '4',
    header5 : '5'
    },{
      header1: '1',
      header2: '2',
      header3: '3',
      header4 : '4',
      header5 : '5'
    },
    { header1: '1',
      header2: '2',
      header3: '3',
      header4 : '4',
      header5 : '5'
    },
    { header1: '1',
    header2: '2',
    header3: '3',
    header4 : '4',
    header5 : '5'
    },{
      header1: '1',
      header2: '2',
      header3: '3',
      header4 : '4',
      header5 : '5'
    },
    { header1: '1',
      header2: '2',
      header3: '3',
      header4 : '4',
      header5 : '5'
    },
    { header1: '1',
    header2: '2',
    header3: '3',
    header4 : '4',
    header5 : '5'
    },{
      header1: '1',
      header2: '2',
      header3: '3',
      header4 : '4',
      header5 : '5'
    },
    { header1: '1',
      header2: '2',
      header3: '3',
      header4 : '4',
      header5 : '5'
    },
    { header1: '1',
    header2: '2',
    header3: '3',
    header4 : '4',
    header5 : '5'
    },{
      header1: '1',
      header2: '2',
      header3: '3',
      header4 : '4',
      header5 : '5'
    },
    { header1: '1',
      header2: '2',
      header3: '3',
      header4 : '4',
      header5 : '5'
    },
    { header1: '1',
    header2: '2',
    header3: '3',
    header4 : '4',
    header5 : '5'
    },{
      header1: '1',
      header2: '2',
      header3: '3',
      header4 : '4',
      header5 : '5'
    },
    { header1: '1',
      header2: '2',
      header3: '3',
      header4 : '4',
      header5 : '5'
    },
    { header1: '1',
    header2: '2',
    header3: '3',
    header4 : '4',
    header5 : '5'
    }];

  rowSelection = 'multiple';
  gridApi!: GridApi;
  gridColumnApi : any

  frameworkComponents : any

  map: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/streets-v11';
  lat = 35.8617;
  lng = 104.1954;

  ngOnInit(): void {
    setTimeout(()=>{
      mapboxgl.accessToken = "pk.eyJ1IjoiY29vbGprIiwiYSI6ImNsNTh2NWpydjAzeTQzaGp6MTEwN2E0MDcifQ.AOl86UqKc-PxKcwj9kKZtA"
      this.map = new mapboxgl.Map({
        container: 'map',
        style: this.style,
        zoom: 4,
        center: [this.lng, this.lat]
      });
      this.map.addControl(new mapboxgl.NavigationControl());
    },1)
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridApi.sizeColumnsToFit();
  }

}

import { Component, OnInit } from '@angular/core';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';

@Component({
  selector: 'app-alarm-history',
  templateUrl: './alarm-history.component.html',
  styleUrls: ['./alarm-history.component.css']
})
export class AlarmHistoryComponent implements OnInit {

  constructor() { }

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


  startDatePicker : any
  endDatePicker : any

  ngOnInit(): void {

  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridApi.sizeColumnsToFit();
  }

}

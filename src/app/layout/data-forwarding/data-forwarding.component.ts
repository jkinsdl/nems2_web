import { Component, OnInit } from '@angular/core';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';

@Component({
  selector: 'app-data-forwarding',
  templateUrl: './data-forwarding.component.html',
  styleUrls: ['./data-forwarding.component.css']
})
export class DataForwardingComponent implements OnInit {

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
    {
      header1: '1',
      header2: '2',
      header3: '3',
      header4 : '4',
      header5 : '5'
    },
    {
      header1: '1',
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

  constructor() { }

  ngOnInit(): void {

  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridApi.sizeColumnsToFit();
  }

}
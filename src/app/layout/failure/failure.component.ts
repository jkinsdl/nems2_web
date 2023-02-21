import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { WarningIssueComponent } from 'src/app/component/warning-issue/warning-issue.component';

@Component({
  selector: 'app-failure',
  templateUrl: './failure.component.html',
  styleUrls: ['./failure.component.css']
})
export class FailureComponent implements OnInit {

  constructor(
    private dialog: MatDialog,
  ) { }
  columnDefs: ColDef[] = [
    { field: 'vin' },
    { field: 'create_time', headerName: 'Create Time'},
    { field: 'update_time', headerName : 'Update Time'},
    { field: 'state', headerName : 'State' },
    { field: 'max_warning', headerName : 'Max Warning' },
    { field: 'warning_flag', headerName : 'Warning Flag' },
    { field: 'region', headerName : 'REGION' },
    { field: 'comments', headerName : 'Comments' },
    { field: 'docurrend_time', headerName : 'Docurrent Time' },
    { field: 'view_popup', headerName : 'View Popup' },
  ];

  rowData = [
      { vin: 'vin',
      create_time: 'create_time',
      update_time: 'update_time',
      state : 'state',
      max_warning : 'max_warning',
      warning_flag : 'warning_flag',
      region : 'region',
      comments : 'comments',
      docurrend_time : 'docurrend_time',
      view_popup : 'view_popup'
    },
    { vin: 'vin',
    create_time: 'create_time',
    update_time: 'update_time',
    state : 'state',
    max_warning : 'max_warning',
    warning_flag : 'warning_flag',
    region : 'region',
    comments : 'comments',
    docurrend_time : 'docurrend_time',
    view_popup : 'view_popup'
  },
  { vin: 'vin',
  create_time: 'create_time',
  update_time: 'update_time',
  state : 'state',
  max_warning : 'max_warning',
  warning_flag : 'warning_flag',
  region : 'region',
  comments : 'comments',
  docurrend_time : 'docurrend_time',
  view_popup : 'view_popup'
  }];
  gridApi!: GridApi;

  ngOnInit(): void {
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }



  openModify(){
    const dialogRef = this.dialog.open( WarningIssueComponent, {
      data:{
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){

      }
    });
  }
}

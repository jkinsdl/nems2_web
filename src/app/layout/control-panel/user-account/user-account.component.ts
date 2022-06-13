import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CellClickedEvent, ColDef, GridApi, GridReadyEvent, RowClassParams, RowClassRules } from 'ag-grid-community';
import { AddUserComponent } from 'src/app/component/add-user/add-user.component';
import { AlertPopupComponent } from 'src/app/component/alert-popup/alert-popup.component';
import { CommonConstant } from 'src/app/util/common-constant';

@Component({
  selector: 'app-user-account',
  templateUrl: './user-account.component.html',
  styleUrls: ['./user-account.component.css']
})

export class UserAccountComponent implements OnInit {

  constant : CommonConstant = new CommonConstant()

  constructor(
    private dialog: MatDialog,
  ) { }
  columnDefs: ColDef[] = [
    { field: 'selected', hide:true},
    { field: 'user', headerName: 'User' },
    { field: 'role', headerName: 'ROLE'},
    { field: 'region', headerName : 'Region'},
    { field: 'locale', headerName : 'LOCALE' },
    { field: 'created', headerName : 'Created' },
    { field: 'last_login', headerName : 'Last Login' },
    { field: 'enabled', headerName : 'Enabled' },
    { field: 'credentials_Ex', headerName : 'credentials Ex' },
    { field: 'account_expired', headerName : 'Account Expired' },
    { field: 'play_sound1', headerName : 'Play Sound1' },
    { field: 'play_sound2', headerName : 'Play Sound2' },
    { field: 'play_sound3', headerName : 'Play Sound3' },
    { field: 'play_sound4', headerName : 'Play Sound4' },
    { field: 'play_sound5', headerName : 'Play Sound5' },

  ];

  rowData = [
      {
      selected : false,
      user: 'user',
      role: 'role',
      region: 'region',
      locale : 'locale',
      created : 'created',
      last_login : 'last_login',
      enabled : 'enabled',
      credentials : 'credentials',
      credentials_Ex : 'credentials_Ex',
      account_expired : 'account_expired',
      play_sound1 : 'play_sound1',
      play_sound2 : 'play_sound2',
      play_sound3 : 'play_sound3',
      play_sound4 : 'play_sound4',
      play_sound5 : 'play_sound5'
    },

    {
    selected : false,
    user: 'user',
    role: 'role',
    region: 'region',
    locale : 'locale',
    created : 'created',
    last_login : 'last_login',
    enabled : 'enabled',
    credentials : 'credentials',
    credentials_Ex : 'credentials_Ex',
    account_expired : 'account_expired',
    play_sound1 : 'play_sound1',
    play_sound2 : 'play_sound2',
    play_sound3 : 'play_sound3',
    play_sound4 : 'play_sound4',
    play_sound5 : 'play_sound5'
  },
  {
    selected : false,
    user: 'user',
      role: 'role',
      region: 'region',
      locale : 'locale',
      created : 'created',
      last_login : 'last_login',
      enabled : 'enabled',
      credentials : 'credentials',
      credentials_Ex : 'credentials_Ex',
      account_expired : 'account_expired',
      play_sound1 : 'play_sound1',
      play_sound2 : 'play_sound2',
      play_sound3 : 'play_sound3',
      play_sound4 : 'play_sound4',
      play_sound5 : 'play_sound5'
    }
  ];

  selectNodeID : string = null;
  public rowSelection = 'multiple';
  private gridApi!: GridApi;

  ngOnInit(): void {

  }

  userClick(event : CellClickedEvent){
    this.selectNodeID = event.node.id
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  addUser(){
    const dialogRef = this.dialog.open( AddUserComponent, {
      data:{
        type : this.constant.ADD_TYPE
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){

      }
    });
  }

  modifyUser(){
    if(this.gridApi.getSelectedRows().length != 0){
      const dialogRef = this.dialog.open( AddUserComponent, {
        data:{
          type : this.constant.MODIFY_TYPE,
          user : this.gridApi.getRowNode(this.selectNodeID)
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if(result){
        }
      });
    }
  }

  deleteUser(){
    if(this.gridApi.getSelectedRows().length != 0){
      const dialogRef = this.dialog.open( AlertPopupComponent, {
        data:{
          alertTitle : "User Delete",
          alertContents : "Do you want to delete a user ? (User ID : " + this.gridApi.getRowNode(this.selectNodeID).data.user+ ")",
          alertType : this.constant.ALERT_WARNING,
          popupType : this.constant.POPUP_CHOICE,
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if(result){
          this.selectNodeID = null;
          this.gridApi.applyTransaction({ remove: this.gridApi.getSelectedRows() })!;
        }
      });
    }
  }
}

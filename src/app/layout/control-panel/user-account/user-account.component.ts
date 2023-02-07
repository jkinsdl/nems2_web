import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CellClickedEvent, ColDef, GridApi, GridReadyEvent, RowClassParams, RowClassRules } from 'ag-grid-community';
import { AddUserComponent } from 'src/app/component/add-user/add-user.component';
import { AlertPopupComponent } from 'src/app/component/alert-popup/alert-popup.component';
import { SearchFilter } from 'src/app/object/searchFilter';
import { UserService } from 'src/app/service/user.service';
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
    private userService : UserService

  ) { }
  columnDefs: ColDef[] = [
    { field: 'selected', hide:true},
    { field: 'username', headerName: 'username' },
    { field: 'userId', headerName: 'userId'},
    { field: 'status', headerName : 'status'},
    { field: 'email', headerName : 'email' },
    { field: 'authorityId', headerName : 'authorityId' },
    { field: 'latestAccess', headerName : 'latestAccess' }
  ];

  users : any = {
    count : 0,
    users : [],
    link : {}
  }


  selectNodeID : string = null;
  public rowSelection = 'multiple';
  private gridApi!: GridApi;

  searchFilter : SearchFilter = new SearchFilter()

  ngOnInit(): void {
    this.getUsers()
  }

  getUsers(){
    this.userService.getUsers(this.searchFilter).subscribe(res=>{
      console.log(res)
      this.users = res.body
    },error=>{
      console.log(error)
    })
  }

  userClick(event : CellClickedEvent){
    this.selectNodeID = event.node.id
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit()
  }

  addUser(){
    const dialogRef = this.dialog.open( AddUserComponent, {
      data:{
        type : this.constant.ADD_TYPE
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.postUsers(result)
      }
    });
  }

  postUsers(parameter : any){
    this.userService.postUsers(parameter).subscribe(res=>{
      console.log(res)
      this.getUsers()
    },error=>{
      console.log(error)
    })
  }

  modifyUser(){
    if(this.gridApi.getSelectedRows().length != 0){
      const dialogRef = this.dialog.open( AddUserComponent, {
        data:{
          type : this.constant.MODIFY_TYPE,
          user : this.gridApi.getRowNode(this.selectNodeID).data
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if(result){
          this.putUsersUserId(result)
        }
      });
    }
  }

  putUsersUserId(parameter : any){
    this.userService.putUsersUserId(parameter).subscribe(res=>{
      console.log(res)
      this.getUsers()
    },error=>{
      console.log(error)
    })
  }


  deleteUser(){
    if(this.gridApi.getSelectedRows().length != 0){
      const dialogRef = this.dialog.open( AlertPopupComponent, {
        data:{
          alertTitle : "User Delete",
          alertContents : "Do you want to delete a user ? (User Name : " + this.gridApi.getRowNode(this.selectNodeID).data.username+ ")",
          alertType : this.constant.ALERT_WARNING,
          popupType : this.constant.POPUP_CHOICE,
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if(result){
          this.deleteUsersUserId(this.gridApi.getRowNode(this.selectNodeID).data.userId)
        }
      });
    }
  }

  deleteUsersUserId(userId : string){
    this.userService.deleteUsersUserId(userId).subscribe(res=>{
      console.log(res)
      this.gridApi.applyTransaction({ remove: this.gridApi.getSelectedRows() })!;
      this.selectNodeID = null;
    },error=>{
      console.log(error)
    })
  }

}

import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CellClickedEvent, ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { AddUserComponent } from 'src/app/component/add-user/add-user.component';
import { AlertPopupComponent } from 'src/app/component/alert-popup/alert-popup.component';
import { GridTooltipComponent } from 'src/app/component/grid-tooltip/grid-tooltip.component';
import { SearchFilter } from 'src/app/object/searchFilter';
import { UserService } from 'src/app/service/user.service';
import { UtilService } from 'src/app/service/util.service';
import { CommonConstant } from 'src/app/util/common-constant';
//import 'ag-grid-enterprise'
@Component({
  selector: 'app-user-account',
  templateUrl: './user-account.component.html',
  styleUrls: ['./user-account.component.css']
})

export class UserAccountComponent implements OnInit {

  constant : CommonConstant = new CommonConstant()

  constructor(
    private dialog: MatDialog,
    private userService : UserService,
    private utilService : UtilService

  ) { }
  columnDefs: ColDef[] = [
    { field: 'selected', hide:true, tooltipField: 'selected'},
    { field: 'username', headerName: 'username', tooltipField: 'username' },
    { field: 'userId', headerName: 'userId', tooltipField: 'userId'},
    { field: 'status', headerName : 'status', tooltipField: 'status'},
    { field: 'email', headerName : 'email', tooltipField: 'email' },
    { field: 'authorityId', headerName : 'authorityId', tooltipField: 'authorityId' },
    { field: 'latestAccess', headerName : 'latestAccess', valueFormatter : this.utilService.gridDateFormat, tooltipField: 'latestAccess', tooltipComponent : GridTooltipComponent, tooltipComponentParams: { fildName: 'latestAccess' } }
  ];

  users : any = {
    count : 0,
    users : [],
    link : {}
  }


  selectNodeID : string = null;
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


  onBtExport() {
    //this.gridApi.exportDataAsExcel();
    //this.gridApi.exportDataAsCsv()
    this.utilService.gridDataToExcelData("User Account", this.gridApi,this.users.users)
  }

}

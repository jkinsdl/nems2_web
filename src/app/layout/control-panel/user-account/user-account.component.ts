import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CellClickedEvent, ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { Subscription } from 'rxjs';
import { AddUserComponent } from 'src/app/component/add-user/add-user.component';
import { AlertPopupComponent } from 'src/app/component/alert-popup/alert-popup.component';
import { BtnCellRendererComponent } from 'src/app/component/btn-cell-renderer/btn-cell-renderer.component';
import { GridTooltipComponent } from 'src/app/component/grid-tooltip/grid-tooltip.component';
import { SearchFilter } from 'src/app/object/searchFilter';
import { UiService } from 'src/app/service/ui.service';
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

  @ViewChild('userGrid', { read: ElementRef }) userGrid : ElementRef;


  constant : CommonConstant = new CommonConstant()

  constructor(
    private dialog: MatDialog,
    private userService : UserService,
    private utilService : UtilService,
    private uiService : UiService
  ) { }
  columnDefs: ColDef[] = [
    { field: 'selected', hide:true, tooltipField: 'selected'},
    { field: 'username', headerName: 'username', tooltipField: 'username' },
    { field: 'email', headerName : 'email', tooltipField: 'email' },
    { field: 'authorityId', headerName : 'authority', tooltipField: 'authorityId' },
    { field: 'status', headerName : 'status', tooltipField: 'status'},
    { field: 'latestAccess', headerName : 'latestAccess', valueFormatter : this.utilService.gridDateFormat, tooltipField: 'latestAccess', tooltipComponent : GridTooltipComponent, tooltipComponentParams: { fildName: 'latestAccess', type : 'date' } },
    { field: 'action', cellRenderer: BtnCellRendererComponent,
    cellRendererParams: {
      modify: (field: any) => {
        this.modifyUser(field)
      },
      delete : (field: any) => {
        this.deleteUser(field)
      },
    }, width:120},
  ];

  users : any = {
    count : 0,
    users : [],
    link : {}
  }

  selectNodeID : string = null;
  gridApi!: GridApi;


  page$ : Subscription
  searchFilter : SearchFilter = new SearchFilter()
  gridHeight : number
  pageSize : number
  currentPage : number = 1

  ngAfterViewInit() {
    this.getPageSize()
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    if(this.page$)this.page$.unsubscribe()
  }

  ngOnInit(): void {
    this.page$ = this.uiService.page$.subscribe((page : number)=>{
      this.currentPage = page
      this.getPageSize()
    })
  }

  getPageSize(){
    this.gridHeight = this.userGrid.nativeElement.offsetHeight;
    this.pageSize = this.uiService.getGridPageSize(this.gridHeight)
    this.getUsers()
  }

  onResize(event : any){
    if(this.gridHeight != this.userGrid.nativeElement.offsetHeight){
      this.getPageSize()
    }
  }

  getUsers(){
    this.searchFilter.offset = (this.currentPage-1) * this.pageSize
    this.searchFilter.limit = this.pageSize
    this.userService.getUsers(this.searchFilter).subscribe(res=>{
      console.log(res)
      this.users = res.body
      let pagination = {
        count : this.users.count,
        pageSize : this.pageSize,
        page : this.currentPage
      }
      this.uiService.setPagination(pagination)
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

  modifyUser(field :any){
    const dialogRef = this.dialog.open( AddUserComponent, {
      data:{
        type : this.constant.MODIFY_TYPE,
        user : field
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.putUsersUserId(result)
      }
    });

  }

  putUsersUserId(parameter : any){
    this.userService.putUsersUserId(parameter).subscribe(res=>{
      console.log(res)
      this.getUsers()
    },error=>{
      console.log(error)
    })
  }


  deleteUser(field : any){
      const dialogRef = this.dialog.open( AlertPopupComponent, {
        data:{
          alertTitle : "User Delete",
          alertContents : "Do you want to delete a user ? (User Name : " + field.username+ ")",
          alertType : this.constant.ALERT_WARNING,
          popupType : this.constant.POPUP_CHOICE,
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if(result){
          this.deleteUsersUserId(field.userId)
        }
      });
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
    this.searchFilter.offset = undefined
    this.searchFilter.limit = undefined
    this.userService.getUsers(this.searchFilter).subscribe(res=>{
      console.log(res)
      this.utilService.gridDataToExcelData("User Account", this.gridApi,res.body.users)
    },error=>{
      console.log(error)
    })
  }

  setSearch(){
    this.uiService.setCurrentPage(1);
  }
}

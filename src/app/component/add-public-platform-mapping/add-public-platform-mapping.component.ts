import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SearchFilter } from 'src/app/object/searchFilter';
import { ForwardingService } from 'src/app/service/forwarding.service';
import { UtilService } from 'src/app/service/util.service';
import { CommonConstant } from 'src/app/util/common-constant';

@Component({
  selector: 'app-add-public-platform-mapping',
  templateUrl: './add-public-platform-mapping.component.html',
  styleUrls: ['./add-public-platform-mapping.component.css']
})
export class AddPublicPlatformMappingComponent implements OnInit {
  constant : CommonConstant = new CommonConstant()
  constructor(
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<AddPublicPlatformMappingComponent>,
    @Inject(MAT_DIALOG_DATA) public data : any,
    private forwardingService : ForwardingService,
    private utilService : UtilService
  ) { }

  datePicker : any

  vinText : string = ""

  irrelevantList : any[] = []

  ngOnInit(): void {
    this.datePicker = new Date()
    this.getForwardingServerNameIrrelevant(this.data.serverName)


  }

  getForwardingServerNameIrrelevant(serverName : string){
    this.forwardingService.getForwardingServerNameIrrelevant(serverName, new SearchFilter()).subscribe(res=>{
      console.log(res)
      this.irrelevantList = res.body.entities
    },error=>{
      console.log(error)
    })
  }

  addForwardingRelations(){

    if(this.vinText == ""){
      this.utilService.alertPopup("ADD Forwarding relations ","Please enter vin.",this.constant.ALERT_CONFIRMATION)
      return
    }

    this.dialogRef.close(this.vinText)
  }

  close(){
    this.dialogRef.close()
  }


}

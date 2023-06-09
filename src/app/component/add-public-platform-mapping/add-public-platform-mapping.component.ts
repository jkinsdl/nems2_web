import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SearchFilter } from 'src/app/object/searchFilter';
import { ForwardingService } from 'src/app/service/forwarding.service';
import { UtilService } from 'src/app/service/util.service';
import { CommonConstant } from 'src/app/util/common-constant';
import {Router} from '@angular/router';

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
    private utilService : UtilService,
    private router: Router
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
      if (error.status === 401 && error.error === "Unauthorized"){
        this.utilService.alertPopup("Token has expired", "Please login again.", this.constant.ALERT_WARNING);
        // Redirect to the login page
        this.router.navigate(['/component/login']);
      }
    })
  }

  addForwardingRelations(){

    if(this.vinText == ""){
      this.utilService.alertPopup("ADD Forwarding relations ","Please enter vin.",this.constant.ALERT_CONFIRMATION)
      return
    }

    let parameter = {
      vin : this.vinText
    }

    this.forwardingService.postForwardingServerNameRelations(this.data.serverName,parameter).subscribe(res=>{
      console.log(res)
      this.dialogRef.close(true)
    },error=>{
      console.log(error)
      if (error.status === 401 && error.error === "Unauthorized"){
        this.utilService.alertPopup("Token has expired", "Please login again.", this.constant.ALERT_WARNING);
        // Redirect to the login page
        this.router.navigate(['/component/login']);
      }else {
      this.utilService.alertPopup("Vehicle Model", error.statusText + " : " + error.error, this.constant.ALERT_WARNING)
      }
    })


  }

  close(){
    this.dialogRef.close()
  }


}

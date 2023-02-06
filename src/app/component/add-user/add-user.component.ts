import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from 'src/app/service/user.service';
import { UtilService } from 'src/app/service/util.service';
import { CommonConstant } from 'src/app/util/common-constant';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {
  constant : CommonConstant = new CommonConstant()
  constructor(
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<AddUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data : any,
    private utilService : UtilService,
    private userService : UserService
  ) { }

  addUserParameter : any = {
    email : "",
    username : "",
    authorityId : "",
    contact : {
      e164Number : "",
      shortCode : {
        regionCode : "",
        number : ""
      },
      extension : ""
    },
    attributes : {}
  }

  ngOnInit(): void {
    console.log(this.data)
    if(this.data.user){
      this.getUsersUsersId()
    }
  }

  getUsersUsersId(){
    this.userService.getUsersUserId(this.data.user.userId).subscribe(res=>{
      console.log(res)
      //this.addUserParameter = res.body
      this.addUserParameter.userId = res.body.userId
      this.addUserParameter.email = res.body.email
      this.addUserParameter.username = res.body.username
      this.addUserParameter.authorityId = res.body.authorityId
      this.addUserParameter.contact = res.body.contact
      this.addUserParameter.attributes = res.body.attributes

    },error=>{
      console.log(error)
    })
  }

  addUser(){

    console.log("addUser")

    if(this.addUserParameter.email == ""){
      this.utilService.alertPopup("User Add", "Please enter your E-mail.", this.constant.ADD_TYPE)
      return
    }

    if(this.addUserParameter.username == ""){
      this.utilService.alertPopup("User Add", "Please enter your User Name.", this.constant.ADD_TYPE)
      return
    }

    if(this.addUserParameter.authorityId == ""){
      this.utilService.alertPopup("User Add", "Please select a authority ID ", this.constant.ADD_TYPE)
      return
    }

    this.dialogRef.close(this.addUserParameter)

  }

  modifyUser(){

    if(this.addUserParameter.email == ""){
      this.utilService.alertPopup("User Add", "Please enter your E-mail.", this.constant.ADD_TYPE)
      return
    }

    if(this.addUserParameter.username == ""){
      this.utilService.alertPopup("User Add", "Please enter your User Name.", this.constant.ADD_TYPE)
      return
    }

    if(this.addUserParameter.authorityId == ""){
      this.utilService.alertPopup("User Add", "Please select a authority ID ", this.constant.ADD_TYPE)
      return
    }

    this.dialogRef.close(this.addUserParameter)

  }

  close(){
    this.dialogRef.close()
  }

}

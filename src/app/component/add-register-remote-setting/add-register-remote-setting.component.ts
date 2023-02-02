import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonConstant } from 'src/app/util/common-constant';

@Component({
  selector: 'app-add-register-remote-setting',
  templateUrl: './add-register-remote-setting.component.html',
  styleUrls: ['./add-register-remote-setting.component.css']
})
export class AddRegisterRemoteSettingComponent implements OnInit {
  constant : CommonConstant = new CommonConstant()
  constructor(
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<AddRegisterRemoteSettingComponent>,
    @Inject(MAT_DIALOG_DATA) public data : any,
  ) { }

  ngOnInit(): void {
  }

  close(){
    this.dialogRef.close()
  }

}

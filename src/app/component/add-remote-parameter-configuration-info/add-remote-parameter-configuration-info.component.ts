import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonConstant } from 'src/app/util/common-constant';

@Component({
  selector: 'app-add-remote-parameter-configuration-info',
  templateUrl: './add-remote-parameter-configuration-info.component.html',
  styleUrls: ['./add-remote-parameter-configuration-info.component.css']
})
export class AddRemoteParameterConfigurationInfoComponent implements OnInit {
  constant : CommonConstant = new CommonConstant()
  constructor(
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<AddRemoteParameterConfigurationInfoComponent>,
    @Inject(MAT_DIALOG_DATA) public data : any,
  ) { }

  ngOnInit(): void {
  }

  close(){
    this.dialogRef.close()
  }

}

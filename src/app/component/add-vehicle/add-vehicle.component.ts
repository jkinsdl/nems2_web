import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonConstant } from 'src/app/util/common-constant';

@Component({
  selector: 'app-add-vehicle',
  templateUrl: './add-vehicle.component.html',
  styleUrls: ['./add-vehicle.component.css']
})
export class AddVehicleComponent implements OnInit {
  constant : CommonConstant = new CommonConstant()
  constructor(
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<AddVehicleComponent>,
    @Inject(MAT_DIALOG_DATA) public data : any,
  ) { }

  ngOnInit(): void {
  }

  close(){
    this.dialogRef.close()
  }

}

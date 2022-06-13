import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StatisticsPlan } from 'src/app/object/statistics-plan';

@Component({
  selector: 'app-play-statistics-plan',
  templateUrl: './play-statistics-plan.component.html',
  styleUrls: ['./play-statistics-plan.component.css']
})
export class PlayStatisticsPlanComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<PlayStatisticsPlanComponent>,
    @Inject(MAT_DIALOG_DATA) public data : any
  ) { }

  selectedMomentStart : any;
  selectedMomentEnd : any;

  result : any = {}

  ngOnInit(): void {
  }

  closePopup(){
    this.dialogRef.close()
  }

  addPlayStatisticsPlan(){
    console.log(this.selectedMomentStart)
    console.log(this.selectedMomentEnd)
    if(this.selectedMomentStart != undefined){
      this.result.start = this.selectedMomentStart._d
    }

    if(this.selectedMomentEnd != undefined){
      this.result.end = this.selectedMomentEnd._d
    }

    this.result.statisticsPlan = this.data
    this.dialogRef.close(this.result)
  }
}

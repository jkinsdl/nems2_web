import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { StatisticsPlan } from 'src/app/object/statistics-plan';

@Component({
  selector: 'app-create-statistics-plan',
  templateUrl: './create-statistics-plan.component.html',
  styleUrls: ['./create-statistics-plan.component.css']
})
export class CreateStatisticsPlanComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<CreateStatisticsPlanComponent>,
  ) { }

  statisticsPlanList : StatisticsPlan = new StatisticsPlan()

  ngOnInit(): void {
  }

  closePopup(){
    this.dialogRef.close()
  }

  createStatistics(){
    this.dialogRef.close(this.statisticsPlanList)
  }

}

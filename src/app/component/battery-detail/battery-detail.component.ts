import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as echarts from 'echarts';

@Component({
  selector: 'app-battery-detail',
  templateUrl: './battery-detail.component.html',
  styleUrls: ['./battery-detail.component.css']
})
export class BatteryDetailComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<BatteryDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data : any,
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.setVoltageChart()
    }, 100);
  }

  close(){
    this.dialogRef.close()
  }




  setVoltageChart(){
    var chartDom = document.getElementById('voltageChart')!;
    var myChart = echarts.init(chartDom);
    var option: echarts.EChartsOption;

    option = {
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
//        show :false

      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: [120, 200, 150, 80, 70, 110, 130],
          type: 'bar'
        }
      ]
    };

    option && myChart.setOption(option);
  }


}

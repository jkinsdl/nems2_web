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


  voltageCategory : string[] = []
  voltageData : any[] = []
  ngOnInit(): void {

    console.log(this.data)

    setTimeout(() => {
      this.setVoltageChart(this.data.powerBatteryInfos[0])
      this.setTemperatureChart(this.data.powerBatteryTemperatures[0])
    }, 100);
  }

  close(){
    this.dialogRef.close()
  }

  setVoltageChart(voltageData : any){
    for(let i = 0; i < voltageData.cellAmperes.length; i++){
      this.voltageCategory.push("Cell#" + (i+1))
      //this.voltageData.push((Math.random() + 3).toFixed(2))
      this.voltageData.push(voltageData.cellAmperes[i])
    }

    var chartDom = document.getElementById('voltageChart')!;
    var myChart = echarts.init(chartDom);
    var option: echarts.EChartsOption;

    option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      xAxis: {
        type: 'category',
        data: this.voltageCategory,
        show :false

      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: this.voltageData,
          type: 'bar'
        }
      ]
    };

    option && myChart.setOption(option);
  }

  setTemperatureChart(temperatureData : any){
    let xAxisDatas = []
    let data : any[] = []
    for(let i = 0; i < temperatureData.sensorTemps.length; i++){
      xAxisDatas.push("Cell#" + (i+1))
      data.push([i,0,temperatureData.sensorTemps[i]])
    }

    /*const data = [
      [0,0,15],[0,1,15],[0,2,14],[0,3,15],[0,4,15],[0,5,14],[0,6,12],[0,7,16],[0,8,15],[0,9,14],[0,10,15],[0,11,15],[0,12,15],[0,13,14],[0,14,16],[0,15,14]]
        .map(function (item) {
            return [item[1], item[0], item[2] || '-'];
        });
    */
    var chartDom = document.getElementById('temperatureChart')!;
    var myChart = echarts.init(chartDom);
    var option: echarts.EChartsOption;

    option = {
      tooltip: {
        position: 'top'
      },
      grid: {
        height: '50%',
        top: '10%'
      },
      xAxis: {
        type: 'category',
        data: xAxisDatas,
        show: false,
        splitArea: {
          show: false
        }
      },
      yAxis: {
        type: 'category',
        data: [''],
        show: false,
        splitArea: {
          show: true
        }
      },
      visualMap: {
        min: 10,
        max: 50,
        calculable: true,
        orient: 'horizontal',
        left: 'center',
        bottom: '15%'
      },
      series: [
        {
          name: 'Temperature',
          type: 'heatmap',
          data: data,
          label: {
            show: true
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
    option && myChart.setOption(option);
  }


}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonConstant } from 'src/app/util/common-constant';

@Component({
  selector: 'app-remote-control',
  templateUrl: './remote-control.component.html',
  styleUrls: ['./remote-control.component.css']
})
export class RemoteControlComponent implements OnInit {

  constant : CommonConstant = new CommonConstant()
  constructor(
    public router: Router,
  ) { }

  ngOnInit(): void {

  }


}

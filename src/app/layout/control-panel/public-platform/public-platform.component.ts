import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-public-platform',
  templateUrl: './public-platform.component.html',
  styleUrls: ['./public-platform.component.css']
})
export class PublicPlatformComponent implements OnInit {

  constructor(
    public router: Router,
  ) { }

  ngOnInit(): void {
  }

}

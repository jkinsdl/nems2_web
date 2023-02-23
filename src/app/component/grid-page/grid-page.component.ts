import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UiService } from 'src/app/service/ui.service';

@Component({
  selector: 'app-grid-page',
  templateUrl: './grid-page.component.html',
  styleUrls: ['./grid-page.component.css']
})
export class GridPageComponent implements OnInit {

  constructor(
    private uiService : UiService
  ) { }

  pagination = {
    count : 0,
    pageSize : 0,
    page : 0
  }

  pagination$ : Subscription
  pagination2$ : Subscription

  pageArray : number[] = []
  currentPage : number = 0;

  isPreviousTurn : boolean = false;
  isPageNextTurn : boolean = false;

  @Input() gridNumber : number;

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.

  }

  ngOnInit(): void {

    if(this.gridNumber == 1){
      this.pagination$ = this.uiService.pagination$.subscribe((pagination:any)=>{
        this.pagination = pagination
        this.setPageArray()
      })
    }else if(this.gridNumber == 2){
      this.pagination2$ = this.uiService.pagination2$.subscribe((pagination:any)=>{
        this.pagination = pagination
        this.setPageArray()
      })
    }

  }

  setPageArray(){
    if(this.pagination){
      this.pageArray = [];
      this.isPageNextTurn = false;
      this.isPreviousTurn = false;
      this.currentPage = this.pagination.page

      let i = 0
      if(this.currentPage != 0 && this.currentPage % 10 == 0){
        i = (Math.floor(this.currentPage / 10) - 1) * 10
      }else{
        i = Math.floor(this.currentPage / 10) * 10
      }

      if(i !=0 ){
        this.isPreviousTurn = true
      }

      for(i; i<this.pagination.count/this.pagination.pageSize; i++){
        this.pageArray.push((i + 1 ))
        if(this.pageArray.length > 9){
          this.isPageNextTurn = true
          break;
        }
      }

      if(this.currentPage > this.pageArray[this.pageArray.length-1]){
        this.clickPage(this.pageArray[this.pageArray.length-1])
      }

    }
  }

  clickPrevious(){
    if(this.currentPage > 1){
      let page = this.currentPage - 1
      this.clickPage(page)

    }
  }

  clickPage(page : number){
    if(this.currentPage != page){
      this.currentPage = page
      if(this.gridNumber == 1){
        this.uiService.chagnePage(this.currentPage)
      }else if(this.gridNumber == 2){
        this.uiService.chagnePage2(this.currentPage)
      }

    }
  }

  clickNext(){
    if(this.currentPage < this.pagination.count/this.pagination.pageSize){
      let page = this.currentPage + 1
      this.clickPage(page)
    }
  }

  clicPagePreviousTurn(){
    let pageAddIndex = 9 + (this.currentPage % 10 )
    let page = this.currentPage - pageAddIndex;
    this.clickPage(page)
  }

  clicPageNextTurn(){
    let pageAddIndex = 11 - (this.currentPage % 10 )
    let page = this.currentPage + pageAddIndex;
    this.clickPage(page)
  }

}

import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { IFilterAngularComp } from 'ag-grid-angular';
import { IDoesFilterPassParams, IFilterParams } from 'ag-grid-community';

@Component({
  selector: 'app-checkbox-filter',
  templateUrl: './checkbox-filter.component.html',
  styleUrls: ['./checkbox-filter.component.css']
})
export class CheckboxFilterComponent implements IFilterAngularComp  {

  constructor(
    private _formBuilder: FormBuilder
  ){}

  params: IFilterParams;
  toppings = this._formBuilder.group({})

  agInit(params: { toppings: any } & IFilterParams): void {
    this.params = params;
    this.toppings = params.toppings
    console.log(this.toppings.value)
  }

  isFilterActive(): boolean {
      return true
  }

  doesFilterPass(params: IDoesFilterPassParams): boolean {
      return true;
  }

  getModel() {
  }

  setModel(model: any) {
  }

  updateFilter() {
    this.params.filterChangedCallback();
  }

}

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GridActionType, GridColumn, GridRowActionEvent, GridCellActionEvent } from './grid.interfaces';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit {

  private columns: Array<GridColumn>;

  @Input('columns')
  set _columns(value: Array<GridColumn | string>) {
    this.columns = [];
    value.forEach( (column: GridColumn | string) => {
      if ( typeof column === 'string' ) {
        this.columns.push({
          field: column,
          title: column,
          formatter: ((data) => data.value),
          style: '',
          class: ''
        });
      } else {
        this.columns.push({
          field: column.field,
          title: column.title || column.field,
          formatter: column.formatter || ((data) => data.value),
          style: column.style || '',
          class: column.class || ''
        });
      }
    });
  }

  @Input() records: Array<object> = [];
  @Output() rowAction = new EventEmitter<GridRowActionEvent>();
  @Output() cellAction = new EventEmitter<GridCellActionEvent>();

  constructor() {
    this.columns = [];
  }

  ngOnInit() {}

  onRowAction(event: GridRowActionEvent) {
    this.rowAction.emit(event);
  }

  onCellAction(event: GridCellActionEvent) {
    this.cellAction.emit(event);
  }

}

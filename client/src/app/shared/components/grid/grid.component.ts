import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {
  GridColumn,
  GridActionEvent,
  GridActionButton,
  GridRowEvent
} from './grid.interfaces';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit {

  private columns: Array<GridColumn>;
  private showActionsColumn = false;

  @Input('columns')
  set _columns(value: Array<GridColumn | string>) {
    this.columns = [];
    value.forEach((column: GridColumn | string) => {
      if (column === 'ACTIONS') {
        this.showActionsColumn = true;
      } else if (typeof column === 'string') {
        this.columns.push({
          field: column,
          title: column,
          formatter: ((data) => data.value),
          style: '',
          headClass: '',
          cellClass: '',
          filtered: false,
          sort: '',
          highlightMap: []
        });
      } else {
        this.columns.push({
          field: column.field,
          title: column.title || column.field,
          formatter: column.formatter || ((data) => data.value),
          style: column.style || '',
          headClass: column.headClass || '',
          cellClass: column.cellClass || '',
          filtered: column.filtered || false,
          sort: column.sort || '',
          highlightMap: column.highlightMap || [],
        });
      }
    });
  }

  @Input() records: Array<object> = [];
  @Input() tableClass: string;

  @Input() getRowClass: ($event: GridRowEvent) => string;
  @Input() getActions: ($event: GridRowEvent) => GridActionButton[];

  @Output() onAction = new EventEmitter<GridActionEvent>();
  @Output() onTitleClick = new EventEmitter<GridColumn>();

  constructor() {
    this.columns = [];
  }

  ngOnInit() {}

  _getRowClass($event: GridRowEvent) {
    if (this.getRowClass) {
      return this.getRowClass($event);
    }
    return '';
  }

  _getActions($event: GridRowEvent) {
    if (!this.showActionsColumn) { return null; }
    if (this.getActions) {
      return this.getActions($event);
    }
    return [];
  }

  _onTitleClick($event: GridColumn) {
    if (this.onAction) {
      this.onTitleClick.emit($event);
    }
  }
  _onAction($event: GridActionEvent) {
    if (this.onAction) {
      this.onAction.emit($event);
    }
  }

  highlightCell(column: GridColumn, value): string {
    if (column.highlightMap) {
      return this.highlightString(
        value, column.highlightMap,
        '<span class="text-primary font-italic font-weight-bold">', '</span>'
      );
    }
    return value;
  }

  highlightString( value: string, highlightStrings: Array<string>, prefix: string, postfix: string ) {
    value = String(value);

    // get all substrings segments
    const allSegments = [];
    highlightStrings.forEach(v => {
      if (v === null) { return; }
      const pos = value.toLowerCase().search(v.toLowerCase());
      if (pos >= 0) {
        allSegments.push({start: pos, stop: pos + v.length});
      }
    });
    // sort all segments
    allSegments.sort((a, b) => {
      return (a.start > b.start) ? 1 : ((b.start > a.start) ? -1 : (a.stop > b.stop) ? 1 : ((b.stop > a.stop) ? -1 : 0));
    });

    // grouping segments
    const groupedSegments = [];
    let previousSegment: {start: number, stop: number} | null = null;
    allSegments.forEach((currentSegment: {start: number, stop: number}) => {
      if (previousSegment === null ) {
        previousSegment = currentSegment;
        return;
      }

      // case #1
      // previousValue: |----|
      // currentValue :        |----|
      if (previousSegment.stop < currentSegment.start) {
        groupedSegments.push(previousSegment);
        previousSegment = currentSegment;
        return;
      }
      // case #2
      // previousValue: |-----|
      // currentValue :   |-|
      if (previousSegment.start <= currentSegment.start && previousSegment.stop >= currentSegment.stop) {
        return;
      }
      // case #3
      // previousValue: |-----|
      // currentValue :   |------|
      if (previousSegment.start <= currentSegment.start && previousSegment.stop < currentSegment.stop) {
        previousSegment = { start: previousSegment.start, stop: currentSegment.stop };
        return;
      }

    });

    if (previousSegment !== null) {
      groupedSegments.push(previousSegment);
    }
    groupedSegments.reverse();

    groupedSegments.forEach((currentSegment: {start: number, stop: number}) => {
      value =
        value.substring(0, currentSegment.start)
        + prefix
        + value.substring(currentSegment.start, currentSegment.stop)
        + postfix
        + value.substring(currentSegment.stop);
    });

    return value;
  }

}

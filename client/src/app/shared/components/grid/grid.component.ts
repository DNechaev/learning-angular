import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {
  GridColumn,
  GridRowActionEvent,
  GridCellActionEvent,
  GridHighlightMap,
  GridActionButton
} from './grid.interfaces';

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

  @Input() highlightMap: GridHighlightMap = {};
  @Input() records: Array<object> = [];
  @Input() actions: Array<GridActionButton> = [];
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

  highlightCell(column: GridColumn, value): string {
    if (column.field in this.highlightMap) {
      return this.highlightString(
        value, this.highlightMap[column.field],
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
      const pos = value.search(v);
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

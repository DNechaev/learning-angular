export interface GridActionEvent {
  action: string;
  record: object;
  records: Array<object>;
  index: number;
  transferData?: any;
}

export interface GridFormatterEvent {
  value: any;
  record?: object;
  index?: number;
  records?: Array<any>;
  column?: GridColumn;
}

type FunctionFormatter = (GridFormatterEvent) => string;

export type SortDirection = 'asc' | 'desc' | '';

export interface GridColumn {
  field: string;
  title?: string;
  style?: string;
  headClass?: string;
  cellClass?: string;
  formatter?: FunctionFormatter;
  sort?: SortDirection;
  filtered?: boolean;
  highlightMap?: Array<string>;
}
export type GridColumnList = Array<GridColumn|string>;

export interface GridHighlightMap {
  [key: string]: Array<string>;
}

export interface GridFilterMap {
  [key: string]: string;
}

export interface GridSortMap {
  [key: string]: SortDirection;
}

export interface GridActionButton {
  actionName: string;
  class: any;
  title: string;
  html: string;
  transferData?: any;
}

export interface GridRowEvent {
  record: object;
  records: Array<object>;
  index: number;
}

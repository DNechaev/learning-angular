export interface GridRowActionEvent {
  action: string;
  record: object;
  records: Array<object>;
  index: number;
  transferData?: any;
}

export interface GridCellActionEvent {
  action: string;
  record: object;
  records: Array<object>;
  index: number;
  value: any;
  valueFormatted: string;
  column: GridColumn;
}

export interface GridFormatterEvent {
  value: any;
  record?: object;
  index?: number;
  records?: Array<any>;
  column?: GridColumn;
}

type FunctionFormatter = (GridFormatterEvent) => string;

export interface GridColumn {
  field: string;
  title?: string;
  style?: string;
  class?: string;
  formatter?: FunctionFormatter;
}

export interface GridHighlightMap {
  [key: string]: Array<string>;
}

export interface GridActionButton {
  actionName: string;
  class: any;
  title: string;
  html: string;
  transferData?: any;
}
